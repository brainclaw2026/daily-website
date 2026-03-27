import { XMLParser } from 'fast-xml-parser';
import type { SourceAdapter } from '@/lib/ingest/types';
import { getEnv } from '@/lib/utils/env';
import { sevenDaysAgo } from '@/lib/utils/date';

interface RssGuid {
  '#text'?: string;
}

interface RssItem {
  title?: string;
  description?: string;
  link?: string;
  pubDate?: string;
  guid?: string | RssGuid;
  'dc:creator'?: string;
}

interface ParsedRssFeed {
  rss?: {
    channel?: {
      item?: RssItem | RssItem[];
    };
  };
}

const RSS_FEEDS = ['cs.RO', 'cs.AI', 'cs.CV', 'cs.LG', 'eess.SY'] as const;

const STRONG_TERMS = [
  'embodied',
  'robot',
  'robotics',
  'humanoid',
  'manipulation',
  'grasp',
  'locomotion',
  'teleoperation',
  'teleop',
  'navigation',
  'vision-language-action',
  'vla',
  'vlm',
  'world model',
  'slam',
  'localization',
  'odometry',
  'sensor fusion',
  'underwater',
  'auv',
  'rov',
];

const BANNED_TERMS = ['quantum', 'protein', 'medical imaging', 'stock prediction', 'finance', 'cryptocurrency'];
const FETCH_GAP_MS = 4000;

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripHtml(input: string) {
  return input.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function toGuidString(guid?: string | RssGuid) {
  if (!guid) return '';
  if (typeof guid === 'string') return guid.trim();
  return guid['#text']?.trim() || '';
}

function normalizeArxivLink(link: string) {
  return link.replace('http://arxiv.org/abs/', '').replace('https://arxiv.org/abs/', '').trim();
}

function scoreItem(title: string, summary: string) {
  const haystack = `${title} ${summary}`.toLowerCase();
  const strongHits = STRONG_TERMS.filter((term) => haystack.includes(term)).length;
  const banned = BANNED_TERMS.some((term) => haystack.includes(term));
  let score = strongHits * 2;
  if (haystack.includes('visual language navigation')) score += 2;
  if (haystack.includes('reinforcement learning')) score += 1;
  if (haystack.includes('policy')) score += 1;
  if (haystack.includes('control')) score += 1;
  if (haystack.includes('multi-robot')) score += 1;
  if (banned) score -= 5;
  return { score, banned };
}

async function fetchRssFeed(category: string) {
  const url = `https://export.arxiv.org/rss/${category}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'embodied-ai-daily/0.1 (+rss ingest)',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`arXiv RSS request failed for ${category}: ${response.status}`);
  }

  const xml = await response.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: true,
    trimValues: true,
  });
  const parsed = parser.parse(xml) as ParsedRssFeed;
  return asArray(parsed.rss?.channel?.item);
}

export const arxivSource: SourceAdapter = {
  sourceType: 'arxiv',
  async fetchItems() {
    const env = getEnv();
    const lookbackFrom = new Date(sevenDaysAgo());
    const candidates: Array<{
      title: string;
      summary: string;
      publishedAt: string;
      link: string;
      externalId: string;
      authors: string[];
      score: number;
      category: string;
    }> = [];

    for (const category of RSS_FEEDS) {
      const items = await fetchRssFeed(category);

      for (const item of items) {
        const title = item.title?.trim();
        const summary = stripHtml(item.description || '');
        const guid = toGuidString(item.guid);
        const link = item.link?.trim() || guid;
        const pubDate = item.pubDate ? new Date(item.pubDate) : null;

        if (!title || !summary || !link || !pubDate || Number.isNaN(pubDate.getTime())) {
          continue;
        }

        if (pubDate < lookbackFrom) {
          continue;
        }

        const { score, banned } = scoreItem(title, summary);
        if (banned || score < 3) {
          continue;
        }

        const externalId = normalizeArxivLink(guid || link);

        candidates.push({
          title,
          summary,
          publishedAt: pubDate.toISOString(),
          link,
          externalId,
          authors: item['dc:creator'] ? [item['dc:creator']] : [],
          score,
          category,
        });
      }

      await sleep(FETCH_GAP_MS);
    }

    const deduped = new Map<string, (typeof candidates)[number]>();
    for (const item of candidates) {
      const existing = deduped.get(item.externalId);
      if (!existing || item.score > existing.score) {
        deduped.set(item.externalId, item);
      }
    }

    return Array.from(deduped.values())
      .sort((a, b) => {
        if (+new Date(b.publishedAt) !== +new Date(a.publishedAt)) {
          return +new Date(b.publishedAt) - +new Date(a.publishedAt);
        }
        return b.score - a.score;
      })
      .slice(0, env.ingestMaxItemsPerSource)
      .map((item) => ({
        externalId: item.externalId,
        title: item.title,
        summary: item.summary,
        summaryZh: '',
        publishedAt: item.publishedAt,
        sourceType: 'arxiv' as const,
        primaryUrl: item.link,
        sourceLinks: [
          {
            label: `arXiv (${item.category})`,
            url: item.link,
            sourceType: 'arxiv' as const,
          },
        ],
        authors: item.authors,
        category: 'paper' as const,
        keywords: [],
        tags: [],
        relevanceScore: Math.min(0.98, 0.5 + item.score * 0.06),
        trustScore: 0.9,
        raw: {
          category: item.category,
          source: 'rss',
        } as Record<string, unknown>,
      }));
  },
};

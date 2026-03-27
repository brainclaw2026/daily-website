import { XMLParser } from 'fast-xml-parser';
import type { SourceAdapter } from '@/lib/ingest/types';
import { getEnv } from '@/lib/utils/env';
import { sevenDaysAgo } from '@/lib/utils/date';

interface ArxivEntry {
  id?: string;
  title?: string;
  summary?: string;
  published?: string;
  author?: { name?: string } | Array<{ name?: string }>;
  link?: { '@_href'?: string; '@_title'?: string } | Array<{ '@_href'?: string; '@_title'?: string }>;
}

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1500;

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRetryDelayMs(response: Response, attempt: number) {
  const retryAfter = response.headers.get('retry-after');
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds >= 0) {
      return seconds * 1000;
    }

    const dateMs = Date.parse(retryAfter);
    if (!Number.isNaN(dateMs)) {
      return Math.max(0, dateMs - Date.now());
    }
  }

  return BASE_DELAY_MS * 2 ** (attempt - 1);
}

async function fetchArxivXml(url: string) {
  let lastError: string | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'embodied-ai-daily/0.1 (+local ingest)',
      },
      cache: 'no-store',
    });

    if (response.ok) {
      return response.text();
    }

    lastError = `arXiv request failed: ${response.status}`;
    if (!RETRYABLE_STATUSES.has(response.status) || attempt === MAX_RETRIES) {
      break;
    }

    await sleep(getRetryDelayMs(response, attempt));
  }

  throw new Error(lastError ?? 'arXiv request failed');
}

export const arxivSource: SourceAdapter = {
  sourceType: 'arxiv',
  async fetchItems() {
    const env = getEnv();
    const maxResults = Math.min(Math.max(env.ingestMaxItemsPerSource, 1), 50);
    const query = [
      'all:"embodied ai"',
      'all:"robot learning"',
      'all:"humanoid robot"',
      'all:"vision-language-action"',
      'all:"world model robotics"',
      'all:"robot manipulation"',
      'all:"reinforcement learning robotics"',
      'all:"robot locomotion"',
      'all:"robot control"',
      'all:"robot teleoperation"',
      'all:"visual language navigation"',
      'all:"semantic slam"',
      'all:"distributed slam"',
      'all:"multi-sensor fusion localization"',
      'all:"visual slam"',
      'all:"visual inertial odometry"',
      'all:"visual odometry"',
      'all:"lidar slam"',
      'all:"rgb-d slam"',
      'all:"loop closure"',
      'all:"mapping localization"',
      'all:"sensor fusion robotics"',
      'all:"underwater robot"',
      'all:"auv"',
      'all:"rov"',
    ].join(' OR ');

    const url = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(query)}&sortBy=submittedDate&sortOrder=descending&start=0&max_results=${maxResults}`;
    const xml = await fetchArxivXml(url);
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xml) as { feed?: { entry?: ArxivEntry | ArxivEntry[] } };
    const entries = asArray(parsed.feed?.entry);
    const lookbackFrom = new Date(sevenDaysAgo());

    return entries
      .filter((entry) => entry.title && entry.summary && entry.published && entry.id)
      .filter((entry) => new Date(entry.published as string) >= lookbackFrom)
      .map((entry) => {
        const links = asArray(entry.link);
        const alternate = links.find((link) => !link['@_title'] || link['@_title'] === 'pdf') ?? links[0];
        const authors = asArray(entry.author)
          .map((author) => author.name?.trim())
          .filter((author): author is string => Boolean(author));

        return {
          externalId: entry.id as string,
          title: (entry.title as string).replace(/\s+/g, ' ').trim(),
          summary: (entry.summary as string).replace(/\s+/g, ' ').trim(),
          summaryZh: '',
          publishedAt: entry.published as string,
          sourceType: 'arxiv' as const,
          primaryUrl: alternate?.['@_href'] || (entry.id as string),
          sourceLinks: [
            {
              label: 'arXiv',
              url: alternate?.['@_href'] || (entry.id as string),
              sourceType: 'arxiv' as const,
            },
          ],
          authors,
          category: 'paper' as const,
          keywords: [],
          tags: [],
          relevanceScore: 0,
          trustScore: 0,
          raw: entry as Record<string, unknown>,
        };
      });
  },
};

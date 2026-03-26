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

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
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
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'embodied-ai-daily/0.1 (+local ingest)',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`arXiv request failed: ${response.status}`);
    }

    const xml = await response.text();
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

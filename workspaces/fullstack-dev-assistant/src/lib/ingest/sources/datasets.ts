import type { SourceAdapter } from '@/lib/ingest/types';
import { getEnv } from '@/lib/utils/env';
import { sevenDaysAgo } from '@/lib/utils/date';

interface HfDataset {
  id: string;
  author?: string;
  lastModified?: string;
  createdAt?: string;
  downloads?: number;
  likes?: number;
  tags?: string[];
}

const mustMatch = [
  'robot',
  'robotics',
  'embodied',
  'humanoid',
  'manipulation',
  'grasp',
  'locomotion',
  'navigation',
  'vla',
  'world model',
  'lerobot',
];

const bannedTerms = ['image-generation', 'text-to-image', 'roleplay', 'llm', 'diffusion'];

export const datasetSource: SourceAdapter = {
  sourceType: 'other',
  async fetchItems() {
    const env = getEnv();
    const limit = Math.min(Math.max(env.ingestMaxItemsPerSource * 4, 20), 100);
    const url = `https://huggingface.co/api/datasets?sort=lastModified&direction=-1&limit=${limit}&full=true`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'embodied-ai-daily/0.1 (+dataset ingest)',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Hugging Face datasets request failed: ${response.status}`);
    }

    const json = (await response.json()) as HfDataset[];
    const lookbackFrom = new Date(sevenDaysAgo());

    return json
      .filter((dataset) => dataset.lastModified)
      .filter((dataset) => new Date(dataset.lastModified as string) >= lookbackFrom)
      .map((dataset) => {
        const haystack = [dataset.id, ...(dataset.tags ?? [])].join(' ').toLowerCase();
        const hitCount = mustMatch.filter((term) => haystack.includes(term)).length;
        const banned = bannedTerms.some((term) => haystack.includes(term));
        return { dataset, hitCount, banned };
      })
      .filter(({ hitCount, banned }) => !banned && hitCount >= 1)
      .sort((a, b) => {
        if (b.hitCount !== a.hitCount) return b.hitCount - a.hitCount;
        return (b.dataset.likes ?? 0) - (a.dataset.likes ?? 0);
      })
      .slice(0, env.ingestMaxItemsPerSource)
      .map(({ dataset, hitCount }) => ({
        externalId: dataset.id,
        title: dataset.id,
        summary: `Hugging Face 数据集，方向与具身智能/机器人相关。Downloads: ${dataset.downloads ?? 0}；Likes: ${dataset.likes ?? 0}。`,
        summaryZh: '',
        publishedAt: dataset.lastModified || dataset.createdAt || new Date().toISOString(),
        sourceType: 'other' as const,
        primaryUrl: `https://huggingface.co/datasets/${dataset.id}`,
        sourceLinks: [
          {
            label: 'Hugging Face Dataset',
            url: `https://huggingface.co/datasets/${dataset.id}`,
            sourceType: 'other' as const,
          },
        ],
        authors: dataset.author ? [dataset.author] : [],
        category: 'dataset' as const,
        keywords: dataset.tags ?? [],
        tags: ['数据集'],
        relevanceScore: Math.min(0.96, 0.52 + hitCount * 0.1),
        trustScore: 0.82,
        raw: dataset as unknown as Record<string, unknown>,
      }));
  },
};

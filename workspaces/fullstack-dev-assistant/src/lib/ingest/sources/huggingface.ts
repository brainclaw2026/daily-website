import type { SourceAdapter } from '@/lib/ingest/types';
import { getEnv } from '@/lib/utils/env';
import { sevenDaysAgo } from '@/lib/utils/date';

interface HfModel {
  id: string;
  lastModified?: string;
  pipeline_tag?: string;
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
  'vla',
  'vision-language-action',
  'vlm',
  'world model',
  'teleoperation',
  'teleop',
  'visual language navigation',
  'vln',
  'slam',
  'semantic slam',
  'sensor fusion',
  'localization',
  'underwater',
  'auv',
  'rov',
];
const bannedTerms = ['sdxl', 'flux', 'image-generation', 'text-to-image', 'llm', 'roleplay'];

export const huggingFaceSource: SourceAdapter = {
  sourceType: 'huggingface',
  async fetchItems() {
    const env = getEnv();
    const limit = Math.min(Math.max(env.ingestMaxItemsPerSource * 4, 20), 100);
    const url = `https://huggingface.co/api/models?sort=lastModified&direction=-1&limit=${limit}&full=true`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'embodied-ai-daily/0.1 (+local ingest)',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Hugging Face request failed: ${response.status}`);
    }

    const json = (await response.json()) as HfModel[];
    const lookbackFrom = new Date(sevenDaysAgo());

    return json
      .filter((model) => model.lastModified)
      .filter((model) => new Date(model.lastModified as string) >= lookbackFrom)
      .map((model) => {
        const haystack = [model.id, model.pipeline_tag ?? '', ...(model.tags ?? [])].join(' ').toLowerCase();
        const hitCount = mustMatch.filter((term) => haystack.includes(term)).length;
        const banned = bannedTerms.some((term) => haystack.includes(term));
        return { model, hitCount, banned };
      })
      .filter(({ hitCount, banned }) => !banned && hitCount >= 1)
      .sort((a, b) => {
        if (b.hitCount !== a.hitCount) return b.hitCount - a.hitCount;
        return (b.model.likes ?? 0) - (a.model.likes ?? 0);
      })
      .slice(0, env.ingestMaxItemsPerSource)
      .map(({ model, hitCount }) => ({
        externalId: model.id,
        title: model.id,
        summary: `Hugging Face 模型，方向与具身智能相关。Pipeline: ${model.pipeline_tag || 'unknown'}；Downloads: ${model.downloads ?? 0}；Likes: ${model.likes ?? 0}。`,
        summaryZh: '',
        publishedAt: model.lastModified as string,
        sourceType: 'huggingface' as const,
        primaryUrl: `https://huggingface.co/${model.id}`,
        sourceLinks: [
          {
            label: 'Hugging Face Model',
            url: `https://huggingface.co/${model.id}`,
            sourceType: 'huggingface' as const,
          },
        ],
        authors: [],
        category: 'project' as const,
        keywords: model.tags ?? [],
        tags: [],
        relevanceScore: Math.min(0.95, 0.5 + hitCount * 0.12),
        trustScore: 0.8,
        raw: model as unknown as Record<string, unknown>,
      }));
  },
};

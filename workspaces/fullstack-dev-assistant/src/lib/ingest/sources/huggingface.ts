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

export const huggingFaceSource: SourceAdapter = {
  sourceType: 'huggingface',
  async fetchItems() {
    const env = getEnv();
    const limit = Math.min(Math.max(env.ingestMaxItemsPerSource, 1), 50);
    const search = encodeURIComponent('robotics embodied humanoid vision-language-action');
    const url = `https://huggingface.co/api/models?search=${search}&sort=lastModified&direction=-1&limit=${limit}`;
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
      .map((model) => ({
        externalId: model.id,
        title: model.id,
        summary: `Hugging Face model relevant to embodied AI. Pipeline: ${model.pipeline_tag || 'unknown'}. Downloads: ${model.downloads ?? 0}. Likes: ${model.likes ?? 0}.`,
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
        relevanceScore: 0,
        trustScore: 0,
        raw: model as unknown as Record<string, unknown>,
      }));
  },
};

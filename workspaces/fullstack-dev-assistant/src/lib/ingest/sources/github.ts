import type { SourceAdapter } from '@/lib/ingest/types';
import { getEnv } from '@/lib/utils/env';
import { sevenDaysAgo } from '@/lib/utils/date';

interface GithubRepo {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  updated_at: string;
  created_at: string;
  topics?: string[];
  owner?: { login?: string };
  stargazers_count?: number;
}

export const githubSource: SourceAdapter = {
  sourceType: 'github',
  async fetchItems() {
    const env = getEnv();
    const perPage = Math.min(Math.max(env.ingestMaxItemsPerSource, 1), 50);
    const updatedAfter = sevenDaysAgo().slice(0, 10);
    const query = [
      '(embodied-ai OR robot-learning OR humanoid OR manipulation OR vision-language-action OR world-model)',
      'in:name,description,readme',
      `pushed:>=${updatedAfter}`,
    ].join(' ');

    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=${perPage}`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'embodied-ai-daily/0.1 (+local ingest)',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`GitHub request failed: ${response.status}`);
    }

    const json = (await response.json()) as { items?: GithubRepo[] };
    return (json.items ?? []).map((repo) => ({
      externalId: String(repo.id),
      title: repo.full_name,
      summary: repo.description || 'GitHub repository related to embodied AI or robotics.',
      summaryZh: '',
      publishedAt: repo.updated_at || repo.created_at,
      sourceType: 'github' as const,
      primaryUrl: repo.html_url,
      sourceLinks: [
        {
          label: 'GitHub Repository',
          url: repo.html_url,
          sourceType: 'github' as const,
        },
      ],
      authors: repo.owner?.login ? [repo.owner.login] : [],
      category: 'code' as const,
      keywords: repo.topics ?? [],
      tags: [],
      relevanceScore: 0,
      trustScore: 0,
      raw: repo as unknown as Record<string, unknown>,
    }));
  },
};

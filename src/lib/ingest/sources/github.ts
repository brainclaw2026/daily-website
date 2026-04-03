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
  language?: string | null;
  archived?: boolean;
  fork?: boolean;
}

const strongSignals = [
  'embodied',
  'robot',
  'robotics',
  'humanoid',
  'manipulation',
  'grasp',
  'locomotion',
  'sim2real',
  'world model',
  'vision-language-action',
  'vla',
  'vlm',
  'imitation learning',
  'policy learning',
  'reinforcement learning',
];

const weakSignals = ['agent', 'llm', 'multimodal', 'vision language', 'control'];
const bannedTerms = ['sql', 'postgres', 'database', 'rag', 'trading', 'finance', 'marketing', 'homelab', 'jarvis'];

function scoreRepo(repo: GithubRepo) {
  const text = [repo.full_name, repo.description ?? '', ...(repo.topics ?? [])].join(' ').toLowerCase();
  const strong = strongSignals.filter((term) => text.includes(term)).length;
  const weak = weakSignals.filter((term) => text.includes(term)).length;
  const banned = bannedTerms.some((term) => text.includes(term));
  const stars = repo.stargazers_count ?? 0;

  let score = strong * 3 + weak;
  if (stars >= 10) score += 1;
  if (stars >= 100) score += 1;
  if (repo.language && ['python', 'jupyter notebook', 'c++', 'rust'].includes(repo.language.toLowerCase())) score += 1;
  if (banned) score -= 4;
  return { score, banned };
}

export const githubSource: SourceAdapter = {
  sourceType: 'github',
  async fetchItems() {
    const env = getEnv();
    const perPage = Math.min(Math.max(env.ingestMaxItemsPerSource * 3, 20), 100);
    const updatedAfter = sevenDaysAgo().slice(0, 10);
    const query = [
      '(robotics OR robot OR humanoid OR embodied)',
      'in:name,description,readme',
      `pushed:>=${updatedAfter}`,
      'archived:false',
      'fork:false',
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
    return (json.items ?? [])
      .filter((repo) => !repo.archived && !repo.fork)
      .map((repo) => ({ repo, quality: scoreRepo(repo) }))
      .filter(({ quality }) => !quality.banned && quality.score >= 4)
      .sort((a, b) => {
        if (b.quality.score !== a.quality.score) return b.quality.score - a.quality.score;
        return (b.repo.stargazers_count ?? 0) - (a.repo.stargazers_count ?? 0);
      })
      .slice(0, env.ingestMaxItemsPerSource)
      .map(({ repo, quality }) => ({
        externalId: String(repo.id),
        title: repo.full_name,
        // Use a local variable for the description so we can reuse it for the Chinese summary placeholder
        summary: repo.description || 'GitHub repository related to embodied AI or robotics.',
        summaryZh: repo.description || 'GitHub repository related to embodied AI or robotics.',
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
        relevanceScore: Math.min(0.99, 0.45 + quality.score * 0.08),
        trustScore: 0.76,
        raw: repo as unknown as Record<string, unknown>,
      }));
  },
};

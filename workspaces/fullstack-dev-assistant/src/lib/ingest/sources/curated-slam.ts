import type { SourceAdapter } from '@/lib/ingest/types';

const curatedSlamItems = [
  {
    externalId: 'curated-slam-aim-slam-2603-05097',
    title: 'AIM-SLAM: Dense Monocular SLAM with Adaptive Multi-View Mapping',
    summary:
      'Recent SLAM work focusing on dense monocular mapping, adaptive keyframe selection, and robust localization in visually complex robotic environments.',
    summaryZh: '近期 SLAM 工作，聚焦稠密单目建图、自适应关键帧选择，以及复杂机器人环境中的稳健定位。',
    publishedAt: '2026-03-10T00:00:00.000Z',
    sourceType: 'other' as const,
    primaryUrl: 'https://arxiv.org/abs/2603.05097',
    sourceLinks: [
      {
        label: 'arXiv',
        url: 'https://arxiv.org/abs/2603.05097',
        sourceType: 'other' as const,
      },
    ],
    authors: ['arXiv'],
    category: 'paper' as const,
    keywords: ['slam', 'dense mapping', 'monocular slam', 'localization'],
    tags: ['SLAM与定位'],
    relevanceScore: 0.95,
    trustScore: 0.84,
    raw: { curated: true, topic: 'slam' },
  },
  {
    externalId: 'curated-slam-consensus-admm-2603-01178',
    title: 'Consensus ADMM for Real-World Collaborative SLAM',
    summary:
      'A recent collaborative SLAM paper addressing distributed optimization, communication limits, and robust multi-robot mapping in real-world settings.',
    summaryZh: '近期协同 SLAM 论文，面向真实场景下的分布式优化、通信受限与多机器人稳健建图。',
    publishedAt: '2026-03-04T00:00:00.000Z',
    sourceType: 'other' as const,
    primaryUrl: 'https://arxiv.org/abs/2603.01178',
    sourceLinks: [
      {
        label: 'arXiv',
        url: 'https://arxiv.org/abs/2603.01178',
        sourceType: 'other' as const,
      },
    ],
    authors: ['arXiv'],
    category: 'paper' as const,
    keywords: ['slam', 'distributed slam', 'multi-robot', 'mapping'],
    tags: ['SLAM与定位'],
    relevanceScore: 0.94,
    trustScore: 0.84,
    raw: { curated: true, topic: 'slam' },
  },
  {
    externalId: 'curated-slam-lunar-nav-2603-17229',
    title: 'Visual SLAM with DEM Anchoring for Lunar Navigation',
    summary:
      'Recent localization research combining visual SLAM with terrain anchoring and elevation priors to reduce long-range drift in robotic navigation.',
    summaryZh: '近期定位研究，将视觉 SLAM 与地形锚定和高程先验结合，以降低机器人长距离导航中的漂移。',
    publishedAt: '2026-03-20T00:00:00.000Z',
    sourceType: 'other' as const,
    primaryUrl: 'https://arxiv.org/abs/2603.17229',
    sourceLinks: [
      {
        label: 'arXiv',
        url: 'https://arxiv.org/abs/2603.17229',
        sourceType: 'other' as const,
      },
    ],
    authors: ['arXiv'],
    category: 'paper' as const,
    keywords: ['visual slam', 'localization', 'mapping'],
    tags: ['SLAM与定位'],
    relevanceScore: 0.93,
    trustScore: 0.84,
    raw: { curated: true, topic: 'slam' },
  },
];

export const curatedSlamSource: SourceAdapter = {
  sourceType: 'other',
  async fetchItems() {
    return curatedSlamItems;
  },
};

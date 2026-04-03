import type { SourceAdapter } from '@/lib/ingest/types';

const labs = [
  {
    id: 'berkeley-rad-lab',
    title: 'UC Berkeley RAIL / Robotics & Embodied AI Labs',
    summary: '聚焦机器人学习、具身智能、操作与泛化方向的重要实验室与研究组入口。',
    url: 'https://rail.eecs.berkeley.edu/',
  },
  {
    id: 'stanford-vision-robotics-lab',
    title: 'Stanford Vision & Robotics Labs',
    summary: '聚焦机器人感知、操作、视觉语言动作与 embodied intelligence 的实验室入口。',
    url: 'https://ai.stanford.edu/',
  },
  {
    id: 'mit-robotics-lab',
    title: 'MIT Robotics / Embodied Intelligence Labs',
    summary: '聚焦机器人系统、机械臂、学习控制与具身智能方向的重要实验室入口。',
    url: 'https://robotics.mit.edu/',
  },
];

const STABLE_PUBLISHED_AT = '2026-03-23T00:00:00.000Z';

export const labSource: SourceAdapter = {
  sourceType: 'lab',
  async fetchItems() {
    return labs.map((item) => ({
      externalId: item.id,
      title: item.title,
      summary: item.summary,
      summaryZh: '',
      publishedAt: STABLE_PUBLISHED_AT,
      sourceType: 'lab' as const,
      primaryUrl: item.url,
      sourceLinks: [
        {
          label: 'Lab Homepage',
          url: item.url,
          sourceType: 'lab' as const,
        },
      ],
      authors: [],
      category: 'lab' as const,
      keywords: ['lab', 'research group', 'robotics', 'embodied ai'],
      tags: ['实验室动态'],
      relevanceScore: 0.76,
      trustScore: 0.88,
      raw: item as unknown as Record<string, unknown>,
    }));
  },
};

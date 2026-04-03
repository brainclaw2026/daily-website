import type { SourceAdapter } from '@/lib/ingest/types';

const conferenceFeeds = [
  {
    id: 'rssing-robotics-conference',
    title: 'Robotics / Embodied AI Conference Watch',
    summary:
      '聚合机器人、具身智能、Workshop、Call for Papers 与会议通知方向的会议信息入口。当前为过渡版 conference source，后续可替换为 OpenReview / 官网源。',
    url: 'https://roboticsconference.org/',
  },
  {
    id: 'openreview-robotics',
    title: 'OpenReview Robotics & Embodied AI Watch',
    summary:
      '用于跟踪机器人、具身智能、视觉语言动作相关 workshop / conference / call for papers 的会议信息入口。当前为占位聚合源。',
    url: 'https://openreview.net/',
  },
];

export const conferenceSource: SourceAdapter = {
  sourceType: 'conference',
  async fetchItems() {
    const now = new Date().toISOString();

    return conferenceFeeds.map((item) => ({
      externalId: item.id,
      title: item.title,
      summary: item.summary,
      summaryZh: '',
      publishedAt: now,
      sourceType: 'conference' as const,
      primaryUrl: item.url,
      sourceLinks: [
        {
          label: 'Conference Source',
          url: item.url,
          sourceType: 'conference' as const,
        },
      ],
      authors: [],
      category: 'conference' as const,
      keywords: ['conference', 'workshop', 'call for papers', 'robotics', 'embodied ai'],
      tags: ['会议资讯'],
      relevanceScore: 0.78,
      trustScore: 0.9,
      raw: item as unknown as Record<string, unknown>,
    }));
  },
};

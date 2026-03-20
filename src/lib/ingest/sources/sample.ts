import type { SourceAdapter } from '@/lib/ingest/types';
import { sevenDaysAgo } from '@/lib/utils/date';

export const sampleSource: SourceAdapter = {
  sourceType: 'other',
  async fetchItems() {
    return [
      {
        externalId: 'sample-world-model-robotics',
        title: 'World Models for Embodied Robotics: A Practical Weekly Roundup',
        summary:
          'A curated roundup of recent embodied AI work across world models, manipulation, humanoids, and vision-language-action systems.',
        summaryZh: '围绕世界模型、机械臂操作、人形机器人与视觉语言动作系统的一周具身智能动态整理。',
        publishedAt: new Date().toISOString(),
        sourceType: 'other',
        primaryUrl: 'https://example.com/embodied-ai-roundup',
        sourceLinks: [
          {
            label: 'Weekly Roundup',
            url: 'https://example.com/embodied-ai-roundup',
            sourceType: 'other',
          },
        ],
        authors: ['OpenClaw'],
        category: 'project',
        keywords: ['embodied ai', 'world model', 'vision-language-action'],
        tags: ['具身智能', '世界模型', '视觉语言动作'],
        relevanceScore: 0.92,
        trustScore: 0.72,
        raw: {
          collectedAt: new Date().toISOString(),
          lookbackFrom: sevenDaysAgo(),
        },
      },
      {
        externalId: 'sample-humanoid-policy',
        title: 'Humanoid Policy Learning Stack Reaches Sim-to-Real Milestone',
        summary:
          'This update highlights a humanoid training stack that combines large-scale simulation, policy distillation, and dexterous control.',
        summaryZh: '一项人形机器人训练方案展示了结合大规模仿真、策略蒸馏与灵巧控制的 sim-to-real 进展。',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        sourceType: 'other',
        primaryUrl: 'https://example.com/humanoid-policy',
        sourceLinks: [
          {
            label: 'Milestone Note',
            url: 'https://example.com/humanoid-policy',
            sourceType: 'other',
          },
        ],
        authors: ['OpenClaw'],
        category: 'paper',
        keywords: ['humanoid', 'policy learning', 'sim2real'],
        tags: ['人形机器人', '机器人学习', '仿真训练'],
        relevanceScore: 0.9,
        trustScore: 0.7,
        raw: {
          collectedAt: new Date().toISOString(),
          lookbackFrom: sevenDaysAgo(),
        },
      },
    ];
  },
};

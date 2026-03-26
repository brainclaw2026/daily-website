import type { SourceAdapter } from '@/lib/ingest/types';
import { sevenDaysAgo } from '@/lib/utils/date';

export const sampleSource: SourceAdapter = {
  sourceType: 'other',
  async fetchItems() {
    return [
      {
        externalId: 'slam-edge-assisted-multi-robot-vio-2603-11085',
        title: 'Edge-Assisted Multi-Robot Visual-Inertial SLAM',
        summary:
          'Recent arXiv work on collaborative visual-inertial SLAM with robot-edge-cloud architecture, lightweight feature tracking, and bandwidth-aware multi-robot localization.',
        summaryZh: '近期 arXiv 工作，聚焦机器人-边缘-云协同视觉惯性 SLAM，强调多机器人定位、轻量级特征跟踪与带宽约束下的协同建图。',
        publishedAt: '2026-03-15T00:00:00.000Z',
        sourceType: 'other',
        primaryUrl: 'https://arxiv.org/abs/2603.11085',
        sourceLinks: [
          {
            label: 'arXiv',
            url: 'https://arxiv.org/abs/2603.11085',
            sourceType: 'other',
          },
        ],
        authors: ['arXiv'],
        category: 'paper',
        keywords: ['slam', 'visual-inertial odometry', 'localization', 'multi-robot'],
        tags: ['SLAM与定位', '机器人学习'],
        relevanceScore: 0.95,
        trustScore: 0.82,
        raw: {
          curated: true,
          collectedAt: new Date().toISOString(),
          lookbackFrom: sevenDaysAgo(),
        },
      },
      {
        externalId: 'slam-thermal-gaussian-2603-20443',
        title: 'TRGS-SLAM: IMU-Aided Gaussian Splatting for Thermal SLAM',
        summary:
          'Recent SLAM research using thermal imaging and IMU fusion for localization in darkness, smoke, and degraded visual conditions.',
        summaryZh: '近期 SLAM 研究，将热成像与 IMU 融合，用于黑暗、烟雾和退化视觉环境下的定位与建图。',
        publishedAt: '2026-03-23T00:00:00.000Z',
        sourceType: 'other',
        primaryUrl: 'https://arxiv.org/abs/2603.20443',
        sourceLinks: [
          {
            label: 'arXiv',
            url: 'https://arxiv.org/abs/2603.20443',
            sourceType: 'other',
          },
        ],
        authors: ['arXiv'],
        category: 'paper',
        keywords: ['slam', 'sensor fusion', 'imu', 'thermal slam', 'localization'],
        tags: ['SLAM与定位', '多传感器融合定位'],
        relevanceScore: 0.95,
        trustScore: 0.82,
        raw: {
          curated: true,
          collectedAt: new Date().toISOString(),
          lookbackFrom: sevenDaysAgo(),
        },
      },
      {
        externalId: 'slam-event-based-edged-uslam-2603-08150',
        title: 'Edged USLAM: Edge-Aware Event-Based SLAM',
        summary:
          'A recent event-camera SLAM approach for fast motion and poor-light localization, combining edge-aware event processing with inertial cues.',
        summaryZh: '一项近期事件相机 SLAM 方法，面向高速运动与弱光场景，通过边缘感知事件流和惯性信息实现稳健定位。',
        publishedAt: '2026-03-12T00:00:00.000Z',
        sourceType: 'other',
        primaryUrl: 'https://arxiv.org/abs/2603.08150',
        sourceLinks: [
          {
            label: 'arXiv',
            url: 'https://arxiv.org/abs/2603.08150',
            sourceType: 'other',
          },
        ],
        authors: ['arXiv'],
        category: 'paper',
        keywords: ['slam', 'visual odometry', 'event camera', 'localization'],
        tags: ['SLAM与定位'],
        relevanceScore: 0.93,
        trustScore: 0.82,
        raw: {
          curated: true,
          collectedAt: new Date().toISOString(),
          lookbackFrom: sevenDaysAgo(),
        },
      },
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

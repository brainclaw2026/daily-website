import type { ContentCategory, SourceType } from '@/types/content';

export function inferCategory(title: string, summary: string, sourceType: SourceType): ContentCategory {
  const text = `${title} ${summary}`.toLowerCase();

  if (sourceType === 'github') return 'code';
  if (sourceType === 'conference') return 'conference';
  if (sourceType === 'lab') return 'lab';
  if (
    text.includes('dataset') ||
    text.includes('benchmark') ||
    text.includes('corpus') ||
    text.includes('hugging face dataset')
  )
    return 'dataset';
  if (text.includes('workshop') || text.includes('conference') || text.includes('call for papers') || text.includes('openreview'))
    return 'conference';
  if (text.includes('lab') || text.includes('institute') || text.includes('research group') || text.includes('homepage')) return 'lab';
  if (text.includes('model') || text.includes('paper') || sourceType === 'arxiv') return 'paper';
  if (sourceType === 'huggingface') return 'project';
  return 'project';
}

export function inferTags(title: string, summary: string) {
  const text = `${title} ${summary}`.toLowerCase();
  const tags = new Set<string>();
  const rules: Record<string, string[]> = {
    具身智能: ['embodied', 'embodiment'],
    机器人学习: ['robot learning', 'policy'],
    强化学习控制: ['reinforcement learning', 'rl', 'locomotion control', 'robot control'],
    机器人遥操作: ['teleoperation', 'teleop', 'remote operation'],
    机械臂操作: ['manipulation', 'grasp', 'dexterous'],
    人形机器人: ['humanoid'],
    世界模型: ['world model'],
    模仿学习: ['imitation learning', 'behavior cloning'],
    视觉语言动作: ['vision-language-action', 'vla'],
    机器人视觉语言模型: ['robotics vlm', 'vlm'],
    视觉语言导航: ['visual language navigation', 'vln'],
    SLAM与定位: ['slam', 'semantic slam', 'distributed slam', 'localization', 'sensor fusion'],
    水下机器人: ['underwater', 'auv', 'rov'],
    仿真训练: ['sim2real', 'simulation'],
    开源发布: ['open-source', 'github'],
    数据集: ['dataset', 'benchmark', 'corpus', 'hugging face dataset'],
    会议资讯: ['conference', 'workshop', 'call for papers', 'openreview'],
    实验室动态: ['lab', 'research group', 'homepage', 'institute'],
  };

  for (const [tag, needles] of Object.entries(rules)) {
    if (needles.some((needle) => text.includes(needle))) tags.add(tag);
  }

  if (tags.size === 0) tags.add('学术动态');
  return Array.from(tags);
}

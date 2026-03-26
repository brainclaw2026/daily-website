const KEYWORD_RULES = [
  'embodied ai',
  'embodied intelligence',
  'robotics',
  'robot learning',
  'manipulation',
  'humanoid',
  'world model',
  'imitation learning',
  'reinforcement learning',
  'locomotion',
  'teleoperation',
  'teleop',
  'vla',
  'vlm',
  'vision-language-action',
  'visual language navigation',
  'vln',
  'slam',
  'semantic slam',
  'distributed slam',
  'sensor fusion',
  'localization',
  'underwater robotics',
  'underwater robot',
  'auv',
  'rov',
  'multimodal',
  'policy learning',
  'dexterous',
  'sim2real',
] as const;

export function extractKeywords(text: string) {
  const normalized = text.toLowerCase();
  return KEYWORD_RULES.filter((keyword) => normalized.includes(keyword));
}

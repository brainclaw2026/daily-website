const KEYWORD_RULES = [
  'embodied ai',
  'embodied intelligence',
  'robotics',
  'robot learning',
  'manipulation',
  'humanoid',
  'world model',
  'imitation learning',
  'vla',
  'vlm',
  'vision-language-action',
  'multimodal',
  'policy learning',
  'dexterous',
  'sim2real',
] as const;

export function extractKeywords(text: string) {
  const normalized = text.toLowerCase();
  return KEYWORD_RULES.filter((keyword) => normalized.includes(keyword));
}

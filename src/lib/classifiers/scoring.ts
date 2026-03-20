import type { SourceType } from '@/types/content';

const sourceTrustMap: Record<SourceType, number> = {
  arxiv: 0.92,
  huggingface: 0.8,
  github: 0.76,
  lab: 0.88,
  conference: 0.9,
  other: 0.6,
};

const relevanceTerms = ['embodied', 'robot', 'manipulation', 'humanoid', 'world model', 'vla', 'vlm'];

export function computeRelevanceScore(title: string, summary: string, keywords: string[]) {
  const text = `${title} ${summary}`.toLowerCase();
  const matches = relevanceTerms.filter((term) => text.includes(term)).length;
  return Number(Math.min(1, 0.35 + matches * 0.08 + keywords.length * 0.06).toFixed(2));
}

export function getTrustScore(sourceType: SourceType) {
  return sourceTrustMap[sourceType] ?? 0.6;
}

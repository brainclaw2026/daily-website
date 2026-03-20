import { inferCategory, inferTags } from '@/lib/classifiers/tags';
import { extractKeywords } from '@/lib/classifiers/keywords';
import { computeRelevanceScore, getTrustScore } from '@/lib/classifiers/scoring';
import { sha256 } from '@/lib/utils/hash';
import { toSlug } from '@/lib/utils/slug';
import type { IngestedItem, NormalizedItem } from '@/types/content';

export function normalizeItem(item: IngestedItem): NormalizedItem {
  const keywords = item.keywords.length ? item.keywords : extractKeywords(`${item.title} ${item.summary}`);
  const tags = item.tags.length ? item.tags : inferTags(item.title, item.summary);
  const category = item.category || inferCategory(item.title, item.summary, item.sourceType);
  const relevanceScore = item.relevanceScore || computeRelevanceScore(item.title, item.summary, keywords);
  const trustScore = item.trustScore || getTrustScore(item.sourceType);
  const dedupeBase = [item.title.trim().toLowerCase(), item.primaryUrl, item.externalId].join('|');

  return {
    ...item,
    category,
    keywords,
    tags,
    relevanceScore,
    trustScore,
    slug: toSlug(item.title),
    dedupeKey: sha256(dedupeBase),
    mergedSourceTypes: [item.sourceType],
  };
}

export function mergeItems(existing: NormalizedItem, incoming: NormalizedItem): NormalizedItem {
  const sourceLinks = [...existing.sourceLinks];
  for (const link of incoming.sourceLinks) {
    if (!sourceLinks.some((item) => item.url === link.url)) sourceLinks.push(link);
  }

  return {
    ...existing,
    summary: existing.summary.length >= incoming.summary.length ? existing.summary : incoming.summary,
    summaryZh: existing.summaryZh?.length ? existing.summaryZh : incoming.summaryZh,
    sourceLinks,
    tags: Array.from(new Set([...existing.tags, ...incoming.tags])),
    keywords: Array.from(new Set([...existing.keywords, ...incoming.keywords])),
    mergedSourceTypes: Array.from(new Set([...existing.mergedSourceTypes, ...incoming.mergedSourceTypes])),
    relevanceScore: Math.max(existing.relevanceScore, incoming.relevanceScore),
    trustScore: Math.max(existing.trustScore, incoming.trustScore),
  };
}

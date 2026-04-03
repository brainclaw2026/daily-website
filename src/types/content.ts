export type ContentCategory = 'paper' | 'project' | 'dataset' | 'code' | 'conference' | 'lab' | 'slam';

export type SourceType = 'arxiv' | 'huggingface' | 'github' | 'lab' | 'conference' | 'other';

export interface SourceLink {
  label: string;
  url: string;
  sourceType: SourceType;
}

export interface IngestedItem {
  externalId: string;
  title: string;
  summary: string;
  summaryZh?: string;
  publishedAt: string;
  sourceType: SourceType;
  primaryUrl: string;
  sourceLinks: SourceLink[];
  authors?: string[];
  category: ContentCategory;
  keywords: string[];
  tags: string[];
  relevanceScore: number;
  trustScore: number;
  raw: Record<string, unknown>;
}

export interface NormalizedItem extends IngestedItem {
  slug: string;
  dedupeKey: string;
  mergedSourceTypes: SourceType[];
}

export interface FeedFilters {
  q?: string;
  tag?: string;
  category?: ContentCategory | 'all';
  from?: string;
  to?: string;
}

export interface FeedItem extends NormalizedItem {
  id: string;
  createdAt: string;
  isFeatured: boolean;
  sourceCount: number;
}

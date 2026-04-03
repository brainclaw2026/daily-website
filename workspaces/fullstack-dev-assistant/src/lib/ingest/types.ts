import type { IngestedItem, SourceType } from '@/types/content';

export interface SourceAdapter {
  sourceType: SourceType;
  fetchItems: () => Promise<IngestedItem[]>;
}

export interface IngestResult {
  source: SourceType;
  fetched: number;
  inserted: number;
  merged: number;
  failed?: string;
}

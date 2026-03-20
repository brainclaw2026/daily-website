import { normalizeItem, mergeItems } from '@/lib/ingest/normalize';
import type { IngestResult } from '@/lib/ingest/types';
import { sampleSource } from '@/lib/ingest/sources/sample';
import { readStoredItems, writeStoredItems } from '@/lib/content/store';
import type { NormalizedItem } from '@/types/content';

export interface RunIngestSummary {
  ok: boolean;
  fetched: number;
  inserted: number;
  merged: number;
  total: number;
  sources: IngestResult[];
}

export async function runIngest(): Promise<RunIngestSummary> {
  const adapters = [sampleSource];
  const existingFeed = await readStoredItems();
  const itemMap = new Map<string, NormalizedItem>(existingFeed.map((item) => [item.dedupeKey, item]));
  const results: IngestResult[] = [];

  for (const adapter of adapters) {
    try {
      const fetchedItems = await adapter.fetchItems();
      let inserted = 0;
      let merged = 0;

      for (const rawItem of fetchedItems) {
        const normalized = normalizeItem(rawItem);
        const current = itemMap.get(normalized.dedupeKey);

        if (current) {
          itemMap.set(normalized.dedupeKey, mergeItems(current, normalized));
          merged += 1;
        } else {
          itemMap.set(normalized.dedupeKey, normalized);
          inserted += 1;
        }
      }

      results.push({
        source: adapter.sourceType,
        fetched: fetchedItems.length,
        inserted,
        merged,
      });
    } catch (error) {
      results.push({
        source: adapter.sourceType,
        fetched: 0,
        inserted: 0,
        merged: 0,
        failed: error instanceof Error ? error.message : 'Unknown ingest error',
      });
    }
  }

  const items = Array.from(itemMap.values()).sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  await writeStoredItems(items);

  return {
    ok: results.every((result) => !result.failed),
    fetched: results.reduce((sum, result) => sum + result.fetched, 0),
    inserted: results.reduce((sum, result) => sum + result.inserted, 0),
    merged: results.reduce((sum, result) => sum + result.merged, 0),
    total: items.length,
    sources: results,
  };
}

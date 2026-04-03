import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { FeedItem, NormalizedItem } from '@/types/content';

const DATA_PATH = path.join(process.cwd(), 'data', 'content-items.json');

function toFeedItem(item: NormalizedItem, index: number): FeedItem {
  return {
    ...item,
    id: item.dedupeKey,
    createdAt: item.publishedAt,
    isFeatured: index < 3,
    sourceCount: item.sourceLinks.length,
  };
}

async function ensureDataFile() {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, '[]\n', 'utf8');
  }
}

export async function readStoredItems(): Promise<FeedItem[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  const parsed = JSON.parse(raw) as NormalizedItem[];
  return parsed
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .map(toFeedItem);
}

export async function writeStoredItems(items: NormalizedItem[]) {
  await ensureDataFile();
  const sorted = [...items].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  await fs.writeFile(DATA_PATH, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
}

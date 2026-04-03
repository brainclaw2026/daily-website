import type { FeedFilters, FeedItem } from '@/types/content';

export function filterItems(items: FeedItem[], filters: FeedFilters) {
  return items.filter((item) => {
    const q = filters.q?.trim().toLowerCase();
    if (q) {
      const text = [item.title, item.summary, item.summaryZh, item.tags.join(' '), item.keywords.join(' ')].join(' ').toLowerCase();
      if (!text.includes(q)) return false;
    }

    if (filters.tag && filters.tag !== 'all' && !item.tags.includes(filters.tag)) return false;
    if (filters.category && filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.from && +new Date(item.publishedAt) < +new Date(filters.from)) return false;
    if (filters.to && +new Date(item.publishedAt) > +new Date(filters.to)) return false;

    return true;
  });
}

export function collectTags(items: FeedItem[]) {
  return Array.from(new Set(items.flatMap((item) => item.tags))).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
}

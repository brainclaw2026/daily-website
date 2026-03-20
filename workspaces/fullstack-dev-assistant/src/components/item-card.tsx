import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';
import type { FeedItem } from '@/types/content';

interface ItemCardProps {
  item: FeedItem;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">{item.category}</span>
        <span>{formatDate(item.publishedAt)}</span>
        <span>相关性 {item.relevanceScore}</span>
      </div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        <Link href={`/items/${item.slug}`}>{item.title}</Link>
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summaryZh || item.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-sky-50 px-2 py-1 text-xs text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <a href={item.primaryUrl} target="_blank" rel="noreferrer" className="text-sky-600 hover:text-sky-500 dark:text-sky-400">
            查看来源
          </a>
          <span className="text-xs text-slate-400">来源数 {item.sourceCount}</span>
        </div>
        <Link href={`/items/${item.slug}`} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100">
          查看详情 →
        </Link>
      </div>
    </article>
  );
}

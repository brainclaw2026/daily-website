import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';
import type { FeedItem } from '@/types/content';

interface ItemCardProps {
  item: FeedItem;
}

function sourceLabel(sourceType: string) {
  if (sourceType === 'arxiv') return '论文';
  if (sourceType === 'github') return '代码';
  if (sourceType === 'huggingface') return '模型';
  return '动态';
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-white/60 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-slate-900 px-2.5 py-1 font-medium text-white">{sourceLabel(item.sourceType)}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{item.category}</span>
        <span className="text-slate-400">{formatDate(item.publishedAt)}</span>
      </div>

      <h2 className="text-lg font-semibold leading-7 text-slate-900 transition group-hover:text-sky-700">
        <Link href={`/items/${item.slug}`}>{item.title}</Link>
      </h2>

      <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">{item.summaryZh || item.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full bg-sky-50 px-2.5 py-1 text-xs text-sky-700">
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 text-center text-xs text-slate-500">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400">相关性</div>
          <div className="mt-1 font-semibold text-slate-800">{item.relevanceScore}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400">可信度</div>
          <div className="mt-1 font-semibold text-slate-800">{item.trustScore}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400">来源数</div>
          <div className="mt-1 font-semibold text-slate-800">{item.sourceCount}</div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <a href={item.primaryUrl} target="_blank" rel="noreferrer" className="font-medium text-sky-700 hover:text-sky-500">
          查看来源
        </a>
        <Link href={`/items/${item.slug}`} className="text-slate-500 hover:text-slate-900">
          查看详情 →
        </Link>
      </div>
    </article>
  );
}

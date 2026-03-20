import Link from 'next/link';
import { FilterBar } from '@/components/filter-bar';
import { ItemCard } from '@/components/item-card';
import { filterItems, collectTags } from '@/lib/content/filters';
import { readStoredItems } from '@/lib/content/store';
import type { FeedFilters } from '@/types/content';

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function pick(param?: string | string[]) {
  return Array.isArray(param) ? param[0] : param;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const filters: FeedFilters = {
    q: pick(params.q),
    tag: pick(params.tag),
    category: pick(params.category) as FeedFilters['category'],
  };

  const allItems = await readStoredItems();
  const items = filterItems(allItems, filters);
  const tags = collectTags(allItems);
  const featured = items.slice(0, 3);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-slate-950 px-6 py-8 text-white shadow-[0_20px_80px_rgba(15,23,42,0.18)] md:px-8 md:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Embodied AI Daily</p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight md:text-5xl">具身智能前沿信息追踪</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              追踪具身智能、机器人学习、人形机器人、视觉语言动作与世界模型方向的最新论文、代码和模型，优先聚合 arXiv、GitHub、Hugging Face 的新内容。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm text-slate-200 lg:min-w-[320px]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-slate-400">总条目</div>
              <div className="mt-2 text-2xl font-semibold text-white">{allItems.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-slate-400">筛选后</div>
              <div className="mt-2 text-2xl font-semibold text-white">{items.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-slate-400">精选</div>
              <div className="mt-2 text-2xl font-semibold text-white">{featured.length}</div>
            </div>
          </div>
        </div>
      </section>

      <FilterBar q={filters.q} tag={filters.tag} category={filters.category} tags={tags} />

      <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr]">
        {featured.map((item, index) => (
          <div key={item.id} className={index === 0 ? 'lg:row-span-2' : ''}>
            <ItemCard item={item} />
          </div>
        ))}
      </section>

      <section className="grid gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">最新内容</h2>
            <p className="mt-1 text-sm text-slate-500">按时间倒序展示最近采集到的条目，支持关键词、分类和标签过滤。</p>
          </div>
          <Link href="/api/ingest" className="text-sm font-medium text-sky-700 hover:text-sky-500">
            查看 API 入口
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-sm text-slate-500 shadow-sm">
            当前筛选条件下没有内容。先运行一次采集，或者清空筛选条件。
          </div>
        )}
      </section>
    </main>
  );
}

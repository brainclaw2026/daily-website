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
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 md:px-6">
      <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 px-6 py-10 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Embodied AI Daily</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">具身智能前沿信息追踪</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
          聚合具身智能、机器人学习、人形机器人、视觉语言动作与世界模型方向的每日内容。当前会优先抓取 arXiv、GitHub、Hugging Face，并保留少量本地兜底样例避免空列表。
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
          <span className="rounded-full border border-white/10 px-3 py-1">总条目 {allItems.length}</span>
          <span className="rounded-full border border-white/10 px-3 py-1">筛选后 {items.length}</span>
          <span className="rounded-full border border-white/10 px-3 py-1">精选 {featured.length}</span>
        </div>
      </section>

      <FilterBar q={filters.q} tag={filters.tag} category={filters.category} tags={tags} />

      <section className="grid gap-4 md:grid-cols-3">
        {featured.map((item) => (
          <div key={item.id} className="md:col-span-1">
            <ItemCard item={item} />
          </div>
        ))}
      </section>

      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">最新内容</h2>
          <Link href="/api/ingest" className="text-sm text-sky-600 dark:text-sky-400">
            API 入口
          </Link>
        </div>
        {items.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            当前筛选条件下没有内容。先运行一次采集，或者清空筛选条件。
          </div>
        )}
      </section>
    </main>
  );
}

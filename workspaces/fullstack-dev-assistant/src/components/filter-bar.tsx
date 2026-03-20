import type { ContentCategory } from '@/types/content';

const categories: Array<ContentCategory | 'all'> = ['all', 'paper', 'project', 'dataset', 'code', 'conference', 'lab'];

interface FilterBarProps {
  q?: string;
  tag?: string;
  category?: string;
  tags: string[];
}

export function FilterBar({ q, tag = 'all', category = 'all', tags }: FilterBarProps) {
  return (
    <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4 dark:border-slate-800 dark:bg-slate-900">
      <input
        name="q"
        defaultValue={q}
        placeholder="搜索标题、摘要、标签"
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950"
      />
      <select
        name="category"
        defaultValue={category}
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950"
      >
        {categories.map((item) => (
          <option key={item} value={item}>
            {item === 'all' ? '全部分类' : item}
          </option>
        ))}
      </select>
      <select
        name="tag"
        defaultValue={tag}
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950"
      >
        <option value="all">全部标签</option>
        {tags.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-300">
        应用筛选
      </button>
    </form>
  );
}

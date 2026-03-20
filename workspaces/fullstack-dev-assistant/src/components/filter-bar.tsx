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
    <form className="grid gap-3 rounded-3xl border border-white/70 bg-white/85 p-4 shadow-sm ring-1 ring-slate-200/80 backdrop-blur md:grid-cols-[2fr_1fr_1fr_auto]">
      <input
        name="q"
        defaultValue={q}
        placeholder="搜索标题、摘要、标签"
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-sky-400 focus:bg-white"
      />
      <select
        name="category"
        defaultValue={category}
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:bg-white"
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
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:bg-white"
      >
        <option value="all">全部标签</option>
        {tags.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700">
        应用筛选
      </button>
    </form>
  );
}

import Link from 'next/link';
import type { ContentCategory } from '@/types/content';

const categories: Array<ContentCategory | 'all'> = [
'all',
'paper',
'project',
'dataset',
'code',
'conference',
'lab',
'slam',
];

interface FilterBarProps {
q?: string;
tag?: string;
category?: ContentCategory | 'all';
tags: string[];
}

export function FilterBar({ q, tag = 'all', category = 'all', tags }: FilterBarProps) {
return (
<form className="grid gap-3 rounded-3xl border border-white/70 bg-white/85 p-4 shadow-sm ring-1 ring-slate-200/80 backdrop-blur md:grid-cols-[2fr_1fr_1fr_auto]">
<input
name="q"
defaultValue={q}
placeholder="Search titles, summaries, tags"
className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-sky-400 focus:bg-white"
/>

<select
name="category"
defaultValue={category}
className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:bg-white"
>
{categories.map((item) => (
<option key={item} value={item}>
{item}
</option>
))}
</select>

<select
name="tag"
defaultValue={tag}
className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:bg-white"
>
<option value="all">all tags</option>
{tags.map((item) => (
<option key={item} value={item}>
{item}
</option>
))}
</select>

<div className="flex items-center gap-3">
<button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700">
Apply filters
</button>
<Link
href="/"
className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
>
Reset
</Link>
</div>
</form>
);
}

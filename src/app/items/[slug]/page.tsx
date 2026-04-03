import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readStoredItems } from '@/lib/content/store';
import { formatDate } from '@/lib/utils/date';

interface ItemPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { slug } = await params;
  const items = await readStoredItems();
  const item = items.find((entry) => entry.slug === slug);

  if (!item) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 md:px-6">
      <Link href="/" className="text-sm text-sky-600 dark:text-sky-400">
        ← 返回首页
      </Link>
      <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">{item.category}</span>
          <span>{formatDate(item.publishedAt)}</span>
          <span>来源数 {item.sourceCount}</span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold">{item.title}</h1>
        <p className="mt-6 text-base leading-8 text-slate-600 dark:text-slate-300">{item.summaryZh || item.summary}</p>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">标签</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-sky-50 px-2 py-1 text-xs text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">关键词</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.keywords.map((keyword) => (
                <span key={keyword} className="rounded-full bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">来源链接</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {item.sourceLinks.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noreferrer" className="text-sky-600 hover:text-sky-500 dark:text-sky-400">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}

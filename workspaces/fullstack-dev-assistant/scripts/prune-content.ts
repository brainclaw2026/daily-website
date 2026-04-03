import { readStoredItems, writeStoredItems } from '@/lib/content/store';
import type { NormalizedItem } from '@/types/content';

const bannedTerms = ['sql', 'postgres', 'database', 'rag', 'trading', 'finance', 'marketing', 'homelab', 'jarvis'];
const mustMatch = ['robot', 'robotics', 'embodied', 'humanoid', 'manipulation', 'grasp', 'vla', 'vision-language-action', 'sim2real', 'world model'];

function keep(item: NormalizedItem) {
  if (item.sourceType !== 'github' && item.sourceType !== 'huggingface') return true;
  const text = [item.title, item.summary, ...(item.keywords ?? []), ...(item.tags ?? [])].join(' ').toLowerCase();
  if (bannedTerms.some((term) => text.includes(term))) return false;
  return mustMatch.some((term) => text.includes(term));
}

async function main() {
  const items = await readStoredItems();
  const pruned = items.filter((item) => keep(item as NormalizedItem)) as unknown as NormalizedItem[];
  await writeStoredItems(pruned);
  console.log(JSON.stringify({ before: items.length, after: pruned.length, removed: items.length - pruned.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

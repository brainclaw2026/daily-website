import { format, formatDistanceToNowStrict, subDays } from 'date-fns';

export function formatDate(input: string) {
  return format(new Date(input), 'yyyy-MM-dd');
}

export function fromNow(input: string) {
  return formatDistanceToNowStrict(new Date(input), { addSuffix: true });
}

export function sevenDaysAgo() {
  return subDays(new Date(), 7).toISOString();
}

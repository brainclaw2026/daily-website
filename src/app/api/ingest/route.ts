import { NextResponse } from 'next/server';
import { runIngest } from '@/lib/ingest/run';
import { getEnv } from '@/lib/utils/env';

export async function POST(request: Request) {
  const env = getEnv();
  const authHeader = request.headers.get('authorization');
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (env.cronSecret && bearer !== env.cronSecret) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const result = await runIngest();
  return NextResponse.json(result);
}

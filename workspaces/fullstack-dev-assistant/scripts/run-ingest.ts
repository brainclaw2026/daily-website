import { runIngest } from '@/lib/ingest/run';

async function main() {
  const result = await runIngest();
  console.log(JSON.stringify(result, null, 2));

  const failedSources = result.sources.filter((source) => source.failed);
  const summaryLine = [
    `ok=${result.ok}`,
    `fetched=${result.fetched}`,
    `inserted=${result.inserted}`,
    `merged=${result.merged}`,
    `total=${result.total}`,
    `failedSources=${failedSources.length}`,
  ].join(' ');

  console.log(`INGEST_SUMMARY ${summaryLine}`);

  if (failedSources.length > 0) {
    console.log('INGEST_FAILED_SOURCES');
    for (const source of failedSources) {
      console.log(`- ${source.source}: ${source.failed}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

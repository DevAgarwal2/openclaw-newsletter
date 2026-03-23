import { fetchAndStoreLatestRelease } from './src/lib/ai-processor';

console.log('Fetching and processing latest OpenClaw release...');

fetchAndStoreLatestRelease()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
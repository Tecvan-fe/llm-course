import path from 'path';

import { bootstrap } from './app';

async function main() {
  const fileStorageRoot = path.resolve(__dirname, '../node_modules/.cache');

  await bootstrap({ port: 3000 }, { fileStorageRoot });
  console.log(`Start engine at: http://localhost:3000`);
}

main();

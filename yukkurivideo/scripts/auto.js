import {
  generateTranscript,
} from './generateTranscript.js';

import {
  createThumbnail,
} from './createThumbnail.js';

import {
  execSync,
} from 'child_process';

const title =
  process.argv[2];

async function main() {
  console.log(
    'Generating transcript...'
  );

  await generateTranscript(
    title
  );

  console.log(
    'Building voices...'
  );

  execSync(
    'node scripts/buildAutoVideo.js',
    {
      stdio: 'inherit',
    }
  );

  console.log(
    'Creating thumbnail...'
  );

  await createThumbnail(
    title
  );

  console.log(
    'Rendering video...'
  );

  execSync(
    'npm run render',
    {
      stdio: 'inherit',
    }
  );

  console.log(
    'Done'
  );
}

main();
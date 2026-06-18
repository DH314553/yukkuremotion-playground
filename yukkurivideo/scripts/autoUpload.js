import {
  generateMetadata,
} from './generateMetadata.js';

import {
  uploadYoutube,
} from './uploadYoutube.js';

const topic =
  process.argv[2];

async function main() {
  const metadata =
    await generateMetadata(
      topic
    );

  await uploadYoutube({
    videoPath:
      './out/video.mp4',

    thumbnailPath:
      './thumbnail.png',

    title:
      metadata.title,

    description:
      metadata.description,

    tags:
      metadata.tags,
  });

  console.log(
    'YouTube upload complete'
  );
}

main();
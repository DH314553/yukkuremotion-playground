import sharp from 'sharp';

export async function createThumbnail(
  title
) {
  await sharp({
    create: {
      width: 1280,
      height: 720,
      channels: 4,
      background: {
        r: 15,
        g: 23,
        b: 42,
        alpha: 1,
      },
    },
  })
    .png()
    .toFile(
      './thumbnail.png'
    );

  console.log(
    'thumbnail generated'
  );
}
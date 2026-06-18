import fs from 'fs';

import { google }
  from 'googleapis';

import {
  getYoutubeClient,
} from './youtubeAuth.js';

export async function uploadYoutube({
  videoPath,
  thumbnailPath,
  title,
  description,
  tags,
}) {
  const auth =
    await getYoutubeClient();

  const youtube =
    google.youtube({
      version: 'v3',
      auth,
    });

  const response =
    await youtube.videos.insert({
      part: [
        'snippet',
        'status',
      ],

      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: '27',
        },

        status: {
          privacyStatus:
            'private',
        },
      },

      media: {
        body:
          fs.createReadStream(
            videoPath
          ),
      },
    });

  const videoId =
    response.data.id;

  await youtube.thumbnails.set({
    videoId,

    media: {
      body:
        fs.createReadStream(
          thumbnailPath
        ),
    },
  });

  console.log(
    'Uploaded:',
    videoId
  );

  return videoId;
}
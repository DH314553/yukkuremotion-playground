import fs from 'fs';

import { google }
  from 'googleapis';

import {
  getYoutubeClient,
} from './youtubeAuth.js';

export async function uploadScheduledYoutube({
  videoPath,
  title,
  description,
  tags,
  publishAt,
}) {
  const auth =
    await getYoutubeClient();

  const youtube =
    google.youtube({
      version: 'v3',
      auth,
    });

  const result =
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
        },

        status: {
          privacyStatus:
            'private',

          publishAt,
        },
      },

      media: {
        body:
          fs.createReadStream(
            videoPath
          ),
      },
    });

  return result.data.id;
}
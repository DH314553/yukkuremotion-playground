import fs from 'fs';
import path from 'path';

const VOICEVOX_URL =
  process.env.VOICEVOX_URL ||
  'http://127.0.0.1:50021';

export async function generateVoice(
  text,
  speaker,
  outputPath
) {
  const queryRes = await fetch(
    `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(
      text
    )}&speaker=${speaker}`,
    {
      method: 'POST',
    }
  );

  if (!queryRes.ok) {
    throw new Error(
      'VOICEVOX audio_query failed'
    );
  }

  const query =
    await queryRes.json();

  const synthRes = await fetch(
    `${VOICEVOX_URL}/synthesis?speaker=${speaker}`,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify(query),
    }
  );

  if (!synthRes.ok) {
    throw new Error(
      'VOICEVOX synthesis failed'
    );
  }

  const buffer = Buffer.from(
    await synthRes.arrayBuffer()
  );

  fs.mkdirSync(
    path.dirname(outputPath),
    {
      recursive: true,
    }
  );

  fs.writeFileSync(
    outputPath,
    buffer
  );

  return outputPath;
}

export const SPEAKERS = {
  reimu: 1,
  marisa: 8,
};
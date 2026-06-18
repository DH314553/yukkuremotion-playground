import fs from 'fs';

export function createShortsConfig(
  config
) {
  config.video = {
    width: 1080,
    height: 1920,
  };

  fs.writeFileSync(
    './transcripts/shortsConfig.json',
    JSON.stringify(
      config,
      null,
      2
    )
  );
}
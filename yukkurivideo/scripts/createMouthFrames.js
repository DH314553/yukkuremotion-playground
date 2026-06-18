import fs from 'fs';
import wav from 'node-wav';

export function createMouthFrames(
  wavPath,
  fps = 30
) {
  const buffer =
    fs.readFileSync(wavPath);

  const decoded =
    wav.decode(buffer);

  const channel =
    decoded.channelData[0];

  const sampleRate =
    decoded.sampleRate;

  const samplesPerFrame =
    Math.floor(
      sampleRate / fps
    );

  const frames = [];

  const amplitude = [];

  let frameIndex = 0;

  for (
    let i = 0;
    i < channel.length;
    i += samplesPerFrame
  ) {
    const chunk =
      channel.slice(
        i,
        i + samplesPerFrame
      );

    let max = 0;

    for (const sample of chunk) {
      const value =
        Math.abs(sample);

      if (value > max) {
        max = value;
      }
    }

    frames.push(frameIndex);

    amplitude.push(
      Math.round(max * 12)
    );

    frameIndex++;
  }

  return {
    frames,
    amplitude,
  };
}
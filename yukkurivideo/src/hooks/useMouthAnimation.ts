import { useMemo } from 'react';

interface MouthAnimationParams {
  frame: number;
  mouthFrames?: number[];
  mouthAmplitude?: number[];
}

export const useMouthAnimation = ({
  frame,
  mouthFrames = [],
  mouthAmplitude = [],
}: MouthAnimationParams) => {
  return useMemo(() => {
    if (
      mouthFrames.length === 0 ||
      mouthAmplitude.length === 0
    ) {
      return 0;
    }

    let amplitude = 0;

    for (let i = 0; i < mouthFrames.length; i++) {
      if (frame >= mouthFrames[i]) {
        amplitude =
          mouthAmplitude[
            Math.min(
              i,
              mouthAmplitude.length - 1
            )
          ];
      } else {
        break;
      }
    }

    return amplitude;
  }, [
    frame,
    mouthFrames,
    mouthAmplitude,
  ]);
};
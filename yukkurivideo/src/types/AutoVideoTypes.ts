export type Speaker =
  | 'reimu'
  | 'marisa'
  | 'reimuAndMarisa';

export interface Talk {
  speaker: Speaker;

  text: string;

  textForDisplay?: string;

  face?: string;

  audioPath?: string;

  audioDurationFrames?: number;

  mouthFrames?: number[];

  mouthAmplitude?: number[];
}

export interface Section {
  title: string;

  talks: Talk[];

  fromFramesMap: Record<number, number>;

  totalFrames: number;
}

export interface AutoVideoConfig {
  sections: Section[];
}
import React from 'react';
import { Timegroup }
  from '@editframe/react';

import {
  OpeningScene,
} from './scenes/OpeningScene';

import {
  AutoTalkScene,
} from './scenes/AutoTalkScene';

import {
  EndingScene,
} from './scenes/EndingScene';

import {
  AutoVideoConfig,
} from '../transcripts/autoVideo';

const section =
  AutoVideoConfig.sections[0];

export const VideoShorts =
  () => {
    return (
      <Timegroup
        workbench
        mode="sequence"
        className="
          w-[1080px]
          h-[1920px]
        "
      >
        <OpeningScene
          title={
            section.title
          }
        />

        <AutoTalkScene />

        <EndingScene />
      </Timegroup>
    );
  };
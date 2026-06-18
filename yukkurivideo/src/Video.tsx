import React from 'react';
import { Timegroup } from '@editframe/react';

import { OpeningScene }
  from './scenes/OpeningScene';

import { AutoTalkScene }
  from './scenes/AutoTalkScene';

import { EndingScene }
  from './scenes/EndingScene';

import { AutoVideoConfig }
  from '../transcripts/autoVideo';

const section =
  AutoVideoConfig.sections[0];

export const Video = () => {
  const title =
    section?.title ||
    'ゆっくり解説';

  const lastTalk =
    section?.talks?.[
      section.talks.length - 1
    ]?.text ||
    'ゆっくりしていってね！';

  return (
    <Timegroup
      workbench
      mode="sequence"
      className="
        w-[1920px]
        h-[1080px]
      "
    >
      {/* Opening */}

      <OpeningScene
        title={title}
      />

      {/* Main */}

      <AutoTalkScene />

      {/* Ending */}

      <EndingScene
        message={lastTalk}
      />
    </Timegroup>
  );
};
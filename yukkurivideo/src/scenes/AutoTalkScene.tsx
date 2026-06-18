import React from 'react';
import { Timegroup } from '@editframe/react';

import { Character } from '../components/Character';
import { Balloon } from '../components/Balloon';
import { Subtitle } from '../components/Subtitle';
import { Background } from '../components/Background';

import { AutoVideoConfig }
  from '../../transcripts/autoVideo';

const section =
  AutoVideoConfig.sections[0];

export const AutoTalkScene = () => {
  const talks =
    section?.talks || [];

  return (
    <Timegroup mode="sequence">
      {talks.map((talk, index) => {
        const durationFrames =
          talk.audioDurationFrames ||
          180;

        const durationSeconds =
          durationFrames / 30;

        const isReimu =
          talk.speaker === 'reimu';

        const isMarisa =
          talk.speaker === 'marisa';

        const isBoth =
          talk.speaker ===
          'reimuAndMarisa';

        return (
          <Timegroup
            key={index}
            mode="fixed"
            duration={`${durationSeconds}s`}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Background />

              <div
                style={{
                  position: 'absolute',
                  top: 30,
                  left: 40,
                  color: '#ffffff',
                  fontSize: 42,
                  fontWeight: 700,
                  zIndex: 20,
                }}
              >
                {section.title}
              </div>

              {/* Reimu */}

              <Character
                character="reimu"
                speaking={
                  isReimu || isBoth
                }
                mouthOpen={6}
                speakingFrame={isReimu || isBoth ? (index === 0 ? 0 : 1) : 0} /* 💡 喋っているキャラのフレームを切り替える */
                x={50}
                y={180}
              />

              {/* Marisa */}

              <Character
                character="marisa"
                speaking={
                  isMarisa || isBoth
                }
                mouthOpen={6}
                x={1250}
                y={180}
                speakingFrame={isMarisa || isBoth ? (index === 0 ? 0 : 1) : 0} /* 💡 喋っているキャラのフレームを切り替える */
              />

              {/* Balloon */}

              <div
                style={{
                  position: 'absolute',
                  top: 160,
                  left: 430,
                  zIndex: 30,
                }}
              >
                <Balloon
                  text={
                    talk.textForDisplay ||
                    talk.text
                  }
                  speaker={
                    isMarisa
                      ? 'marisa'
                      : 'reimu'
                  }
                />
              </div>

              {/* Subtitle */}

              <Subtitle
                text={
                  talk.textForDisplay ||
                  talk.text
                }
              />
            </div>
          </Timegroup>
        );
      })}
    </Timegroup>
  );
};
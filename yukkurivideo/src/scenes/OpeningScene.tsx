import React from 'react';
import { Timegroup } from '@editframe/react';

interface OpeningSceneProps {
  title: string;
}

export const OpeningScene = ({
  title,
}: OpeningSceneProps) => {
  return (
    <Timegroup
      mode="fixed"
      duration="5s"
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',

          background:
            'radial-gradient(circle at top left, rgba(99,102,241,0.25), transparent 35%), linear-gradient(180deg,#020617,#0f172a)',

          color: 'white',
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: '#a5b4fc',
            marginBottom: 30,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          Yukkuri AI Video
        </div>

        <div
          style={{
            width: 1400,
            textAlign: 'center',
            fontSize: 90,
            lineHeight: 1.2,
            fontWeight: 700,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 50,
            fontSize: 34,
            color: '#cbd5e1',
          }}
        >
          Gemini → VOICEVOX → Editframe
        </div>
      </div>
    </Timegroup>
  );
};
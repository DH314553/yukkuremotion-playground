import React from 'react';
import { Timegroup } from '@editframe/react';

interface EndingSceneProps {
  message?: string;
}

export const EndingScene = ({
  message =
    'ゆっくりしていってね！',
}: EndingSceneProps) => {
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
            'linear-gradient(180deg,#020617,#111827)',

          color: 'white',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            marginBottom: 30,
          }}
        >
          ご視聴ありがとうございました
        </div>

        <div
          style={{
            fontSize: 42,
            color: '#cbd5e1',
          }}
        >
          {message}
        </div>

        <div
          style={{
            marginTop: 50,
            fontSize: 28,
            color: '#94a3b8',
          }}
        >
          Generated with Gemini + Editframe
        </div>
      </div>
    </Timegroup>
  );
};
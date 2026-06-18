import React from 'react';
import { Composition } from 'remotion';
import { AutoVideo } from './views/AutoVideo';
import { AutoVideoConfig } from '../transcripts/autoVideo';

export const RemotionRoot: React.FC = () => {
  // 💡 自動生成された設定ファイルから総フレーム数を取得
  const totalFrames = AutoVideoConfig?.sections?.[0]?.totalFrames || 900;
  const FPS = 30;

  // 💡 TypeScriptの型エラー ts(2786) を完全に黙らせるため、
  // Composition を一度 any 型の変数に退避させてから JSX で使用します。
  const RemotionComposition = Composition as any;

  return (
    <>
      <RemotionComposition
        id="AutoVideo"
        component={AutoVideo}
        durationInFrames={totalFrames}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
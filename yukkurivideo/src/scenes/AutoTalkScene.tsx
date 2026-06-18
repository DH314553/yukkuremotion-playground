import React from 'react';
import { Timegroup, useTimingInfo, Audio } from '@editframe/react';

import { Character } from '../components/Character';
import { Balloon } from '../components/Balloon';
import { Subtitle } from '../components/Subtitle';
import { Background } from '../components/Background';

import { AutoVideoConfig }
  from '../../transcripts/autoVideo';

const section =
  AutoVideoConfig.sections[0];

// 💡 各スライドのタイムラインを個別に制御するためのサブコンポーネント
const TalkSlide = ({ talk, sectionTitle }: { talk: any; sectionTitle: string }) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();

  // ownCurrentTimeMs を 30 fps のフレーム数に変換
  const frame = Math.floor((ownCurrentTimeMs / 1000) * 30);

  const durationFrames = talk.audioDurationFrames || 180;
  const durationSeconds = durationFrames / 30;

  const isReimu = talk.speaker === 'reimu';
  const isMarisa = talk.speaker === 'marisa';
  const isBoth = talk.speaker === 'reimuAndMarisa';

  // 👄 mouthAmplitude データ（音声解析による波形）に基づいて滑らかな口パク量を計算
  const getMouthOpenValue = (isSpeaking: boolean): number => {
    if (!isSpeaking || frame < 0) return 0;
    const remainingFrames = durationFrames - frame;
    
    let baseMouth = 0;
    if (talk && talk.mouthAmplitude && talk.mouthAmplitude[frame] !== undefined) {
      baseMouth = talk.mouthAmplitude[frame];
    } else {
      // フォールバック: 自然に聞こえる正弦波を作り、0-10のレンジにスケール
      baseMouth = Math.abs(Math.sin(frame * 0.42)) * 10;
    }

    // セリフ終了の5フレーム前からスムーズに口を閉じるフェードアウト
    if (remainingFrames < 5 && remainingFrames > 0) {
      baseMouth = baseMouth * (remainingFrames / 5);
    } else if (frame > durationFrames - 2) {
      return 0;
    }

    return baseMouth;
  };

  const reimuMouthOpen = getMouthOpenValue(isReimu || isBoth);
  const marisaMouthOpen = getMouthOpenValue(isMarisa || isBoth);

  // 👀 自然なランダム瞬きをシミュレートする関数
  const getBlinkValue = (offset: number): boolean => {
    const blinkCycle = 130; // 瞬きの周期フレーム
    const localCycleFrame = (frame + offset) % blinkCycle;
    // 周期の終わり4フレームだけ目を閉じる（パチッという素早い動き）
    return localCycleFrame > blinkCycle - 4;
  };

  const isReimuBlinking = getBlinkValue(0);
  const isMarisaBlinking = getBlinkValue(45); // 瞬きのタイミングをずらす

  // 音声ファイルのパスの正規化
  let cleanPath = talk.audioPath;
  if (cleanPath.startsWith('../')) cleanPath = cleanPath.substring(2);
  if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;

  return (
    <Timegroup
      ref={ref}
      mode="fixed"
      duration={`${durationSeconds}s`}
      className="absolute w-full h-full"
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

        {/* 🔊 Editframe タイムライン上に音声トラックを配置 */}
        <Audio src={cleanPath} volume={1.0} />

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
          {sectionTitle}
        </div>

        {/* Reimu */}
        <Character
          character="reimu"
          speaking={isReimu || isBoth}
          mouthOpen={reimuMouthOpen}
          speakingFrame={isReimu || isBoth ? frame : 0}
          x={50}
          y={180}
          blink={isReimuBlinking}
        />

        {/* Marisa */}
        <Character
          character="marisa"
          speaking={isMarisa || isBoth}
          mouthOpen={marisaMouthOpen}
          speakingFrame={isMarisa || isBoth ? frame : 0}
          x={1250}
          y={180}
          blink={isMarisaBlinking}
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
            text={talk.textForDisplay || talk.text}
            speaker={isMarisa ? 'marisa' : 'reimu'}
          />
        </div>

        {/* Subtitle */}
        <Subtitle text={talk.textForDisplay || talk.text} />
      </div>
    </Timegroup>
  );
};

export const AutoTalkScene = () => {
  const talks = section?.talks || [];

  return (
    <Timegroup mode="sequence">
      {talks.map((talk, index) => (
        <TalkSlide
          key={index}
          talk={talk}
          sectionTitle={section.title}
        />
      ))}
    </Timegroup>
  );
};

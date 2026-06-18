import React from 'react';
import { useCurrentFrame, Audio, staticFile } from 'remotion';
import { Character } from '../components/Character';
import { AutoVideoConfig } from '../../transcripts/autoVideo';

export const AutoVideo = () => {
  const frame = useCurrentFrame();
  const section = AutoVideoConfig?.sections?.[0];
  
  // データが正常に読み込めていない場合のフォールバック表示
  if (!section) {
    return <div style={{ flex: 1, backgroundColor: '#0f172a' }} />;
  }

  const { talks, fromFramesMap } = section;

  // ==========================================
  // 🎙️ 1. generateFromFramesMap のロジックに100%準拠したタイムラインマップを構築
  // ==========================================
  const talkTimeline = talks.map((_, i) => {
    // スクリプトが算出した「現在のセリフの開始フレーム」を取得
    const startFrame = Number((fromFramesMap as any)[String(i)]) ?? Number((fromFramesMap as any)[i]) ?? 0;
    
    // 数珠つなぎ構造なので、「次のセリフの開始フレーム」が「現在のセリフの終了フレーム」になる
    const nextStartFrame = Number((fromFramesMap as any)[String(i + 1)]) ?? Number((fromFramesMap as any)[i + 1]);
    
    let endFrame = startFrame + 30; // フォールバック
    
    if (!isNaN(nextStartFrame)) {
      endFrame = nextStartFrame;
    } else {
      // 最後のセリフの場合は、動画全体の総フレーム数を終了位置にする
      endFrame = section.totalFrames ? Number(section.totalFrames) : startFrame + 150;
    }

    return {
      startFrame,
      endFrame,
    };
  });

  // 現在のタイムラインフレームが、どのセリフの区間に属しているかを検索
  const currentTalkIndex = talkTimeline.findIndex(
    (t) => frame >= t.startFrame && frame < t.endFrame
  );

  // 安全弁（シークバーを動かして区間の隙間や末尾に飛んだ場合でも、直近のセリフを維持）
  let safeTalkIndex = currentTalkIndex;
  if (safeTalkIndex === -1) {
    for (let i = talks.length - 1; i >= 0; i--) {
      if (frame >= talkTimeline[i].startFrame) {
        safeTalkIndex = i;
        break;
      }
    }
  }
  if (safeTalkIndex === -1) safeTalkIndex = 0;

  const activeTalk = talks[safeTalkIndex];
  const activeTimeline = talkTimeline[safeTalkIndex];
  
  // セリフ内での経過フレーム（ローカルフレーム）
  const currentSpeakingFrame = Math.max(0, frame - activeTimeline.startFrame);

  // ==========================================
  // 🎭 2. 話者フラグ・滑らかな口パク・目の動き（瞬き）の計算
  // ==========================================
  const isReimuSpeaking = activeTalk 
    ? activeTalk.speaker === 'reimu' || activeTalk.speaker === 'reimuAndMarisa' 
    : false;

  const isMarisaSpeaking = activeTalk 
    ? activeTalk.speaker === 'marisa' || activeTalk.speaker === 'reimuAndMarisa' 
    : false;

  // 👄 滑らかな口パク値を計算する関数
  const getMouthOpenValue = (talk: any, speakingFrame: number, isSpeaking: boolean, timeline: any): number => {
    if (!isSpeaking || speakingFrame < 0) return 0;

    // 話し終わりのフェードアウト処理（セリフの境界でパッと口が止まるのを防ぐ）
    const totalDuration = timeline.endFrame - timeline.startFrame;
    const remainingFrames = totalDuration - speakingFrame;
    
    let baseMouth = 0;
    if (talk && talk.mouthAmplitude && talk.mouthAmplitude[speakingFrame] !== undefined) {
      baseMouth = talk.mouthAmplitude[speakingFrame];
    } else {
      // 自然に聞こえる周期（0.35〜0.45）で綺麗な正弦波を作り、口パクを滑らかに補間 (0-10にスケール)
      baseMouth = Math.abs(Math.sin(speakingFrame * 0.42)) * 10;
    }

    // セリフ終了の5フレーム前から徐々に口を閉じるスムーズ減衰
    if (remainingFrames < 5 && remainingFrames > 0) {
      baseMouth = baseMouth * (remainingFrames / 5);
    } else if (speakingFrame > totalDuration - 2) {
      return 0;
    }

    return baseMouth;
  };

  // 👀 自然なランダム瞬きをシミュレートする関数（120フレーム＝4秒周期で判定）
  const getBlinkValue = (globalFrame: number, offset: number): boolean => {
    const blinkCycle = 130; // 瞬きの周期
    const localCycleFrame = (globalFrame + offset) % blinkCycle;
    // 周期の終わりの4フレームだけ目を閉じる（パチッという素早い動き）
    return localCycleFrame > blinkCycle - 4;
  };

  const reimuMouthOpen = getMouthOpenValue(activeTalk, currentSpeakingFrame, isReimuSpeaking, activeTimeline);
  const marisaMouthOpen = getMouthOpenValue(activeTalk, currentSpeakingFrame, isMarisaSpeaking, activeTimeline);

  const reimuSpeakingFrame = isReimuSpeaking ? currentSpeakingFrame : 0;
  const marisaSpeakingFrame = isMarisaSpeaking ? currentSpeakingFrame : 0;

  // 霊夢と魔理沙の瞬きタイミングをずらすためにオフセットを設定
  const isReimuBlinking = getBlinkValue(frame, 0);
  const isMarisaBlinking = getBlinkValue(frame, 45); // 魔理沙は少しずれて瞬きする

  // ==========================================
  // 🔊 3. 【WAV音声ファイルをタイムライン上に綺麗にずらして並べる】
  // すべてのWAVをループし、fromFramesMap の値に従って正確にタイムラインに一斉配置。
  // ==========================================
  const audioTracks = [];
  const RemotionAudio = Audio as any;

  for (let i = 0; i < talks.length; i++) {
    const talk = talks[i];
    const timeline = talkTimeline[i];
    
    let cleanPath = talk.audioPath;
    if (cleanPath.startsWith('../')) cleanPath = cleanPath.substring(2);
    if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;
    const audioUrl = staticFile(cleanPath);

    audioTracks.push(
      <RemotionAudio
        key={`audio-track-yukkuri-${i}`}
        src={audioUrl}

        // --------------------------------------------------
        // ① 動画のタイムライン上の配置・ずらし制御（★最重要）
        // --------------------------------------------------
        // fromFramesMap から抽出した各WAV固有の絶対開始位置（0, 35, 150...）へ正確にずらして配置
        startInComposition={timeline.startFrame} 

        // --------------------------------------------------
        // ② 音声ファイル自体のトリミング制御
        // --------------------------------------------------
        startFrom={0}                     // 音声ファイルの先頭（0秒目）からピュアに再生

        // --------------------------------------------------
        // ③ 再生終了位置
        // --------------------------------------------------
        // 次のWAVが始まるタイムスタンプで再生をきれいにカット（音声の被りを完全防止）
        endAt={timeline.endFrame}

        // --------------------------------------------------
        // ④ 音質固定オプション
        // --------------------------------------------------
        playbackRate={1.0}
        volume={1.0}
      />
    );
  }

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#0f172a',
        position: 'relative',
        width: 1920,
        height: 1080,
        overflow: 'hidden',
      }}
    >
      {/* 💡 タイムラインの各位置に綺麗にずらして並べられた全音声トラックを展開 */}
      {audioTracks}

      {/* 動画のヘッダータイトル */}
      <h1 style={{
        position: 'absolute', top: 40, left: 60, color: 'white',
        fontSize: '42px', fontFamily: 'sans-serif', opacity: 0.15, fontWeight: 'bold'
      }}>
        {section.title}
      </h1>

      {/* 立ち絵：霊夢 */}
      <Character
        character="reimu"
        speaking={isReimuSpeaking}
        speakingFrame={reimuSpeakingFrame}
        x={150} 
        y={120}
        mouthOpen={reimuMouthOpen} 
        blink={isReimuBlinking} // 瞬きフラグをコンポーネントへ注入
      />

      {/* 立ち絵：魔理沙 */}
      <Character
        character="marisa"
        speaking={isMarisaSpeaking}
        speakingFrame={marisaSpeakingFrame}
        x={1150} 
        y={120}
        mouthOpen={marisaMouthOpen} 
        blink={isMarisaBlinking} // 瞬きフラグをコンポーネントへ注入
      />

      {/* 吹き出し風の字幕テロップ */}
      {activeTalk && (
        <div
          style={{
            position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)',
            width: 1500, backgroundColor: 'rgba(15, 23, 42, 0.9)',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
            border: activeTalk.speaker === 'reimu' 
              ? '5px solid #ef4444' 
              : activeTalk.speaker === 'marisa' 
                ? '5px solid #eab308' 
                : '5px solid #10b981',
            borderRadius: '24px', padding: '35px 60px', zIndex: 100,
          }}
        >
          <p style={{
            color: '#ffffff', fontSize: '46px', fontWeight: 'bold', lineHeight: '1.6',
            whiteSpace: 'pre-wrap', textAlign: 'center', margin: 0, fontFamily: 'sans-serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.6)'
          }}>
            {activeTalk.text}
          </p>
        </div>
      )}
    </div>
  );
};
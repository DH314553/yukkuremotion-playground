import React, { useEffect, useRef, useState } from 'react';
import { staticFile, delayRender, continueRender } from 'remotion';

interface CharacterProps {
  character: 'reimu' | 'marisa';
  speaking: boolean;
  speakingFrame: number;
  mouthOpen: number;
  blink: boolean; /* 👈 瞬きフラグを受け取るプロパティを追加 */
  x?: number;
  y?: number;
}

export const Character = ({
  character,
  mouthOpen,
  x = 0,
  y = 0,
  speakingFrame,
  blink /* 👈 分割代入で受け取り */
}: CharacterProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Remotionのレンダリングを一時停止させるためのハンドルを管理
  const handleRef = useRef<number | null>(null);

  // 👄 mouthOpen の値に応じて口の画像番号を決定
  const mouthIndex =
    mouthOpen > 8
      ? '08'
      : mouthOpen > 4
      ? '04'
      : '00';

  // 👀 blink の値（true/false）に応じて目の画像番号（face）を決定
  // 通常時は 15.png、瞬き時は 16.png (閉じ目) に切り替える
  // 💡 お手持ちの素材に合わせて '16' の部分を適切な閉じ目番号に変更してください
  const faceIndex = blink ? '16' : '15';

  // 各アセットのパス（public/assets/... から取得）
  const bodySrc = staticFile(`/assets/${character}/body/00.png`);
  const faceSrc = staticFile(`/assets/${character}/face/${faceIndex}.png`); // 動的にインデックスを適用
  const mouthSrc = staticFile(`/assets/${character}/mouth/${mouthIndex}.png`);

  useEffect(() => {
    // 1. 画像の読み込みが始まる前に、Remotionのレンダリングを一時停止
    const handle = delayRender(`Loading ${character} layers (blink: ${blink}, mouth: ${mouthIndex})`);
    handleRef.current = handle;
    setIsReady(false);

    // 3枚の画像をプログラム上で読み込む
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // クロスオリジン対策
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
      });
    };

    // すべてのパーツが完全に読み込まれたら Canvas に描画する
    Promise.all([
      loadImage(bodySrc),
      loadImage(faceSrc),
      loadImage(mouthSrc)
    ])
      .then(([bodyImg, faceImg, mouthImg]) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 一度キャンバスをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 3枚のレイヤーを順番に、寸分狂わず重ねて描画
        ctx.drawImage(bodyImg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(faceImg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(mouthImg, 0, 0, canvas.width, canvas.height);

        // 2. 描画が完全に終わったら、レンダリングの一時停止を解除
        setIsReady(true);
        if (handleRef.current !== null) {
          continueRender(handleRef.current);
          handleRef.current = null;
        }
      })
      .catch((err) => {
        console.error('画像の読み込み、またはCanvasの描画に失敗しました。パスを確認してください:', err);
        // エラーが起きても完全にフリーズしないようセーフティ解除
        if (handleRef.current !== null) {
          continueRender(handleRef.current);
        }
      });

    // クリーンアップ
    return () => {
      if (handleRef.current !== null) {
        continueRender(handleRef.current);
      }
    };
  }, [character, faceIndex, mouthIndex, bodySrc, faceSrc, mouthSrc, blink]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 620,
        height: 860,
        zIndex: 50,
      }}
    >
      {/* imgタグを並べるのではなく、1枚のCanvasに結合して出力します。
        これにより、動画エンジンが「まだ画像が読み込まれていない透明なコマ」をキャプチャするのを防ぎます。
      */}
      <canvas
        ref={canvasRef}
        width={620}
        height={860}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          // 完全に描画が完了するまでは非表示にしてチラつきを防止
          opacity: isReady ? 1 : 0, 
        }}
      />
    </div>
  );
};
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

// 💡 Google公式の最新GenAI SDKをインポート
import { GoogleGenAI } from '@google/genai';

// 外部スクリプトのインポート
import { generateVoice, SPEAKERS } from './generateVoice.js';
import { createMouthFrames } from './createMouthFrames.js';

// 環境変数の読み込み (.env)
import dotenv from 'dotenv';
dotenv.config();

const FPS = 30;
let GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
if (GEMINI_MODEL === 'gemini-2.0-flash') {
  console.log(`⚠️  gemini-2.0-flash is discontinued on Vertex AI. Automatically switching to gemini-2.5-flash.`);
  GEMINI_MODEL = 'gemini-2.5-flash';
}

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const keyPath = path.resolve(scriptDir, '../gcp-key.json');

// ==========================================
// 💡 Google Cloud クレジット消費用初期化ロジック
// ==========================================
const ai = new GoogleGenAI({
  vertexai: true,
  project: 'myproject314-459102',
  location: 'asia-northeast1',
  googleAuthOptions: {
    keyFilename: keyPath
  }
});

function durationFrames(mouthFrames) {
  return mouthFrames.length;
}

// ==========================================
// Vertex AI を使って台本を自動生成する関数
// ==========================================
async function generateTranscriptWithGemini(title) {
  console.log(`🤖 Google Cloud Vertex AI (${GEMINI_MODEL}) を呼び出して台本を生成中...: "${title}"`);

  const prompt = `
あなたはゆっくり解説（霊夢と魔理沙）の動画台本制作者です。
お題: "${title}" について、霊夢（reimu）と魔理沙（marisa）の2人が掛け合いで楽しく解説する台本をJSONフォーマットで作成してください。

動画の導入部（挨拶など）や、話の区切り、終わりの挨拶など、必要に応じて2人が同時に声を揃えて話すセリフ（speakerを "reimuAndMarisa" にしたもの）を必ずいくつか含めてください。

必ず以下の厳密なJSON構造のみを出力してください。配列要素の末尾カンマ（トレイリングカンマ）などの構文エラーに極めて注意してください。
解説や前置きテキストは一切含めないでください。

\`\`\`json
{
  "title": "${title}",
  "talks": [
    { "speaker": "reimuAndMarisa", "text": "せーの、ゆっくりしていってね！" },
    { "speaker": "reimu", "text": "ここに霊夢の単独セリフ" },
    { "speaker": "marisa", "text": "ここに魔理沙の単独セリフ" }
  ]
}
\`\`\`

※台本はテンポよく、10〜15往復（セリフ数20〜30個程度）を目安に記述してください。
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Geminiからの応答が空でした。");
    }
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Vertex AI 呼び出しエラー: ${error.message}`);
  }
}

async function buildTalk(talk, index, scriptDir) {
  const speaker = (talk.speaker === 'reimu' || talk.speaker === 'reimuAndMarisa') 
    ? SPEAKERS.reimu 
    : SPEAKERS.marisa;
  
  const publicAudioDir = path.resolve(scriptDir, '../public/assets/audio');
  if (!fs.existsSync(publicAudioDir)) {
    fs.mkdirSync(publicAudioDir, { recursive: true });
  }

  const absoluteAudioPath = path.join(publicAudioDir, `${index}.wav`);
  const publicAudioPath = `/assets/audio/${index}.wav`;

  await generateVoice(talk.text, speaker, absoluteAudioPath);
  const mouthData = createMouthFrames(absoluteAudioPath, FPS);

  return {
    ...talk,
    audioPath: publicAudioPath,
    audioDurationFrames: durationFrames(mouthData.frames),
    mouthFrames: mouthData.frames,
    mouthAmplitude: mouthData.amplitude,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const titleArg = args.find(arg => !arg.startsWith('--')) || "無題の解説動画";
  const usePromptMode = args.includes('--prompt');

  let transcript;

  const transcriptPath = path.resolve(scriptDir, '../transcript.json');

  if (usePromptMode || !fs.existsSync(transcriptPath)) {
    try {
      transcript = await generateTranscriptWithGemini(titleArg);
      fs.writeFileSync(transcriptPath, JSON.stringify(transcript, null, 2), 'utf8');
      console.log('✨ Geminiによる台本の自動生成に成功し、transcript.json に保存しました。');
    } catch (e) {
      console.error('❌ Geminiでの台本生成に失敗しました。テンプレートの読み込みを試みます:', e);
      if (fs.existsSync(transcriptPath)) {
        const templateData = fs.readFileSync(transcriptPath, 'utf8');
        transcript = JSON.parse(templateData);
      } else {
        transcript = {
          title: titleArg,
          talks: [
            { speaker: "reimuAndMarisa", text: "ゆっくりしていってね！" },
            { speaker: "reimu", text: `こんにちは。今回は${titleArg}について解説するよ。` },
            { speaker: "marisa", text: "おいおい、いきなり壮大なお題だな。よろしく頼むぜ。" }
          ]
        };
      }
    }
  } else {
    const templateData = fs.readFileSync(transcriptPath, 'utf8');
    transcript = JSON.parse(templateData);
  }

  const talks = transcript.talks;
  const resultTalks = [];
  let currentFrame = 0;
  const fromFramesMap = {};

  console.log(`🎙️ 音声合成と口パク解析を開始します（全 ${talks.length} セリフ）...`);
  for (let i = 0; i < talks.length; i++) {
    const talk = await buildTalk(talks[i], i, scriptDir);
    resultTalks.push(talk);
    fromFramesMap[i] = currentFrame;
    currentFrame += talk.audioDurationFrames;
  }

  const output = `export const AutoVideoConfig =
${JSON.stringify(
  {
    sections: [
      {
        title: transcript.title,
        talks: resultTalks,
        fromFramesMap,
        totalFrames: currentFrame,
      },
    ],
  },
  null,
  2
)};
`;

  const outputDir = path.resolve(scriptDir, '../transcripts');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outputDir, 'autoVideo.ts'), output);
  console.log('✅ AutoVideoConfig generated successfully!');

  // ==========================================
  // 🎬 Editframe 自動レンダリング ＆ クラッシュ対策
  // ==========================================
  console.log('🎬 Editframe動画のレンダリング処理を開始します...');

  try {
    const result = spawnSync('npx', ['editframe', 'render'], { stdio: 'inherit', shell: true });
    if (result.status === 0) {
      console.log(`\n✨ [SUCCESS] 動画のレンダリングが完全に完了しました！`);
    } else {
      throw new Error(`editframe render がステータスコード ${result.status} で終了しました。`);
    }
  } catch (renderError) {
    console.error('\n❌ Editframeレンダリング中にエラーが発生しました:', renderError.message);
  }
}

main();
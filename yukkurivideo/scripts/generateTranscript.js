import fs from 'fs';
import { GoogleGenerativeAI }
  from '@google/generative-ai';

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

const MODEL =
  'gemini-2.5-pro';

const schema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    talks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          speaker: {
            type: 'string',
            enum: [
              'reimu',
              'marisa',
            ],
          },
          text: {
            type: 'string',
          },
          face: {
            type: 'string',
          },
        },
        required: [
          'speaker',
          'text',
        ],
      },
    },
  },
};

export async function generateTranscript(
  title
) {
  const model =
    genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: {
        responseMimeType:
          'application/json',
        responseSchema:
          schema,
      },
    });

  const prompt = `
ゆっくり解説動画の台本を作成してください。

テーマ:
${title}

条件:
- 霊夢と魔理沙の掛け合い
- 15〜20セリフ
- 初心者向け
- テンポ良く
`;

  const result =
    await model.generateContent(
      prompt
    );

  const json =
    JSON.parse(
      result.response.text()
    );

  fs.writeFileSync(
    './transcript.json',
    JSON.stringify(
      json,
      null,
      2
    )
  );

  return json;
}
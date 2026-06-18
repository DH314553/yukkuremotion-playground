import { GoogleGenerativeAI }
  from '@google/generative-ai';

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

export async function generateMetadata(
  topic
) {
  const model =
    genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
    });

  const prompt = `
YouTube向けのメタデータを生成してください。

テーマ:
${topic}

返却形式:
{
  "title":"",
  "description":"",
  "tags":[]
}
`;

  const result =
    await model.generateContent(
      prompt
    );

  return JSON.parse(
    result.response.text()
  );
}
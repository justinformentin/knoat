import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const model = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const { text } = await generateText({
    model: model('gpt-4o-mini'),
    system:
      'You are a writing assistant. Your responses should only include the exact text asked for, nothing else.',
    prompt,
  });

  return Response.json({ text });
}

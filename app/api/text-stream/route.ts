import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const model = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const result = streamText({
    model: model('gpt-4o-mini'),
    system: 'You are a writing assistant.',
    prompt,
  });

  return result.toDataStreamResponse();
}

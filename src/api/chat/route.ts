import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { tools } from '@/ai/tool';

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: anthropic("claude-3-sonnet-20240229"),
    system: 'You are a friendly assistant!',
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
}
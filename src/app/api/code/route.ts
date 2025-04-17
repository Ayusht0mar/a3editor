import { anthropic } from '@ai-sdk/anthropic';
import { NextResponse } from 'next/server';

const client = anthropic('claude-3-opus-20240229');

export async function POST(req: Request) {
  try {
    const { prompt, language = 'typescript' } = await req.json();

    const response = await client.doGenerate({
      inputFormat: 'messages',
      mode: { type: 'regular' },
      prompt: [{
        role: 'user',
        content: [{
          type: 'text',
          text: `Generate ${language} code based on the following prompt: ${prompt}. 
          Please provide only the code without any explanations or markdown formatting. 
          Make sure the code is complete and can be run directly.`
        }]
      }],
      maxTokens: 1000,
    });

    return NextResponse.json({ 
      code: response.text,
      language 
    });
  } catch (error) {
    console.error('Error generating code:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
} 
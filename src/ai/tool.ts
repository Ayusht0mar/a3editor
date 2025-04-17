import { tool as createTool } from 'ai';
import { z } from 'zod';

export const weatherTool = createTool({
  description: 'Display the weather for a location',
  parameters: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async function ({ location }) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { weather: 'Sunny', temperature: 75, location };
  },
});

export const codeGenerationTool = createTool({
  description: 'Generate code based on a prompt',
  parameters: z.object({
    prompt: z.string().describe('The prompt describing the code to generate'),
    language: z.string().optional().describe('The programming language to generate code in'),
  }),
  execute: async function ({ prompt, language = 'typescript' }) {
    // This will be handled by the API route
    return { prompt, language };
  },
});

export const tools = {
  displayWeather: weatherTool,
  generateCode: codeGenerationTool,
};
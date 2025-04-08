import { groq } from '@ai-sdk/groq';
import { Agent } from '@mastra/core/agent';
import { weatherTool } from '../tools';

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
  You are a helpful assistant that provides weather info using the "weatherTool".

  - Always use the weatherTool to fetch weather.
  - When a user asks about the weather, extract the city name from the conversation history.
  - The weatherTool expects a single string like "Patna" as the 'location' argument.
  - Do not pass full messages, objects, or history into 'location'. Only the city name string.
`,
  model: groq('llama-3.3-70b-versatile'),
  tools: { weatherTool },
});

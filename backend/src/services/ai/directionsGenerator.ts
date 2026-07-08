import { RouteStep } from '@smart-stadiums/shared';
import { callAI } from './client';

import { generateDirectionsFallback } from './fallbackTemplates';

export const generateDirections = async (steps: RouteStep[], language: string, accessibilityRequired: boolean): Promise<{ directions: string, source: 'ai' | 'fallback' }> => {
  const apiKey = process.env.AI_API_KEY || '';
  if (!apiKey) {
    return { directions: generateDirectionsFallback(steps, language), source: 'fallback' };
  }

  try {
    const prompt = `
You are a helpful stadium concierge. The routing algorithm has computed the following path for the user.
Please format these steps into clear, concise natural language directions. 
Language requested: ${language}.
Did the user request an accessible (no stairs) route? ${accessibilityRequired ? 'Yes' : 'No'}. (If yes, reassure them the route is step-free).

Route Steps:
${JSON.stringify(steps, null, 2)}

Provide just the conversational directions, no extra JSON or preamble. Keep it under 4 sentences if possible. Mention congestion if it is high.
`;

    const text = await callAI(prompt, false);
    return { directions: text.trim(), source: 'ai' };
  } catch (error) {
    console.warn('[AI DirectionsGenerator Failed or Timeout]', (error as Error).message);
    return { directions: generateDirectionsFallback(steps, language), source: 'fallback' };
  }
};

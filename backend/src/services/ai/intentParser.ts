import { getDestinationNodeIds } from '@smart-stadiums/domain';
import { callAI } from './client';
import { parseIntentFallback } from './fallbackTemplates';

export const parseIntent = async (query: string): Promise<{ destinationId: string; accessibilityRequired: boolean, source: 'ai' | 'fallback' }> => {
  const apiKey = process.env.AI_API_KEY || '';
  if (!apiKey) {
    return { ...parseIntentFallback(query), source: 'fallback' };
  }

  try {
    const validIds = getDestinationNodeIds();
    const prompt = `
You are an intent parser for a stadium routing app. 
Map the user's query to a valid destination ID and determine if they need an accessible (no stairs) route.
Valid destination IDs: ${validIds.map(id => `"${id}"`).join(', ')}.
Respond with strict JSON in this format: {"destinationId": "string", "accessibilityRequired": boolean}

User Query: "${query}"
`;

    const text = await callAI(prompt, true);
    const parsed = JSON.parse(text);

    if (typeof parsed.destinationId === 'string' && typeof parsed.accessibilityRequired === 'boolean') {
      if (!validIds.includes(parsed.destinationId)) {
        throw new Error('AI returned an invalid destination ID');
      }
      return { destinationId: parsed.destinationId, accessibilityRequired: parsed.accessibilityRequired, source: 'ai' };
    }
    
    throw new Error('Invalid JSON shape from AI');
  } catch (error) {
    console.warn('[AI IntentParser Failed or Timeout]', (error as Error).message);
    return { ...parseIntentFallback(query), source: 'fallback' };
  }
};

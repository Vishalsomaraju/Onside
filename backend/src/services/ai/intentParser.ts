import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseIntentFallback } from './fallbackTemplates';

export const parseIntent = async (query: string): Promise<{ destinationId: string; accessibilityRequired: boolean, source: 'ai' | 'fallback' }> => {
  const apiKey = process.env.AI_API_KEY || '';
  if (!apiKey) {
    return { ...parseIntentFallback(query), source: 'fallback' };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: 'application/json' } });
    
    const prompt = `
You are an intent parser for a stadium routing app. 
Map the user's query to a valid destination ID and determine if they need an accessible (no stairs) route.
Valid destination IDs: "gate-a", "gate-b", "block-101", "restroom-1", "food-1".
Respond with strict JSON in this format: {"destinationId": "string", "accessibilityRequired": boolean}

User Query: "${query}"
`;

    const controller = new AbortController();
    const timeout = setTimeout(controller.abort.bind(controller), 5000); // 5s timeout

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    }, { signal: controller.signal });
    
    clearTimeout(timeout);

    const text = result.response.text();
    const parsed = JSON.parse(text);

    // Naive zod-like runtime check on the JSON response
    if (typeof parsed.destinationId === 'string' && typeof parsed.accessibilityRequired === 'boolean') {
      return { destinationId: parsed.destinationId, accessibilityRequired: parsed.accessibilityRequired, source: 'ai' };
    }
    
    throw new Error('Invalid JSON shape from AI');
  } catch (error) {
    console.warn('[AI IntentParser Failed or Timeout]', (error as Error).message);
    return { ...parseIntentFallback(query), source: 'fallback' };
  }
};

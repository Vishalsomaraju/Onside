import { GoogleGenerativeAI } from '@google/generative-ai';
import { RouteStep } from '@smart-stadiums/shared';
import { generateDirectionsFallback } from './fallbackTemplates';

export const generateDirections = async (steps: RouteStep[], language: string, accessibilityRequired: boolean): Promise<{ directions: string, source: 'ai' | 'fallback' }> => {
  const apiKey = process.env.AI_API_KEY || '';
  if (!apiKey) {
    return { directions: generateDirectionsFallback(steps, language), source: 'fallback' };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
You are a helpful stadium concierge. The routing algorithm has computed the following path for the user.
Please format these steps into clear, concise natural language directions. 
Language requested: ${language}.
Did the user request an accessible (no stairs) route? ${accessibilityRequired ? 'Yes' : 'No'}. (If yes, reassure them the route is step-free).

Route Steps:
${JSON.stringify(steps, null, 2)}

Provide just the conversational directions, no extra JSON or preamble. Keep it under 4 sentences if possible. Mention congestion if it is high.
`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    }, { signal: controller.signal });
    
    clearTimeout(timeout);

    const text = result.response.text();
    
    if (text && text.trim().length > 0) {
      return { directions: text.trim(), source: 'ai' };
    }
    
    throw new Error('Empty AI response');
  } catch (error) {
    console.warn('[AI DirectionsGenerator Failed or Timeout]', (error as Error).message);
    return { directions: generateDirectionsFallback(steps, language), source: 'fallback' };
  }
};

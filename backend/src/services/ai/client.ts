import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Shared helper to call the AI model.
 * Abstracts API key check, model setup, and timeouts.
 */
export const callAI = async (prompt: string, requireJson: boolean = false): Promise<string> => {
  const apiKey = process.env.AI_API_KEY || '';
  if (!apiKey) {
    throw new Error('No API Key');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const config = requireJson ? { responseMimeType: 'application/json' } : undefined;
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: config });

  const controller = new AbortController();
  const timeout = setTimeout(controller.abort.bind(controller), 5000); // 5s timeout

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    }, { signal: controller.signal });
    
    clearTimeout(timeout);
    
    const text = result.response.text();
    if (!text || text.trim().length === 0) {
      throw new Error('Empty AI response');
    }
    
    return text;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
};

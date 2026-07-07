import { parseIntent } from '../intentParser';

const mockGenerateContent = jest.fn();

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: () => ({
          generateContent: mockGenerateContent
        })
      };
    })
  };
});

describe('Intent Parser Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, AI_API_KEY: 'test-key' };
    mockGenerateContent.mockReset();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should parse intent using AI successfully', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify({ destinationId: 'food-1', accessibilityRequired: true }) }
    });

    const res = await parseIntent('i need wheelchair access to food');
    expect(res).toEqual({ destinationId: 'food-1', accessibilityRequired: true, source: 'ai' });
  });

  it('should fallback if AI returns valid JSON but invalid shape', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify({}) }
    });

    const res = await parseIntent('i need wheelchair access to food');
    expect(res.source).toBe('fallback');
  });

  it('should fallback if AI returns malformed JSON', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Not a JSON' }
    });

    const res = await parseIntent('i need wheelchair access to food');
    // The fallback logic kicks in, sees "wheelchair" and "food" -> food-1, true
    expect(res.source).toBe('fallback');
    expect(res.destinationId).toBe('food-1');
  });

  it('should fallback if AI throws (timeout simulation)', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Timeout'));

    const res = await parseIntent('restroom');
    expect(res.source).toBe('fallback');
    expect(res.destinationId).toBe('restroom-1');
  });

  it('should instantly fallback if no API key is provided', async () => {
    process.env.AI_API_KEY = '';
    const res = await parseIntent('restroom');
    expect(res.source).toBe('fallback');
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });
});

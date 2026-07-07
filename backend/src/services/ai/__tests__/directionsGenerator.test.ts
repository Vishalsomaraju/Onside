import { generateDirections } from '../directionsGenerator';
import { RouteStep } from '@smart-stadiums/shared';

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

describe('Directions Generator Service', () => {
  const originalEnv = process.env;
  const mockSteps: RouteStep[] = [
    { nodeId: 'node1', label: 'Node 1', distanceToNext: 10, congestionLevel: 'low', requiresAccessibleDetour: false }
  ];

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, AI_API_KEY: 'test-key' };
    mockGenerateContent.mockReset();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should generate directions using AI successfully', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Go to Node 1.' }
    });

    const res = await generateDirections(mockSteps, 'en', false);
    expect(res).toEqual({ directions: 'Go to Node 1.', source: 'ai' });
  });

  it('should fallback if AI throws', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Timeout'));

    const res = await generateDirections(mockSteps, 'en', false);
    expect(res.source).toBe('fallback');
    expect(res.directions).toContain('Please follow these steps');
  });

  it('should instantly fallback if no API key is provided', async () => {
    process.env.AI_API_KEY = '';
    const res = await generateDirections(mockSteps, 'en', false);
    expect(res.source).toBe('fallback');
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });
});

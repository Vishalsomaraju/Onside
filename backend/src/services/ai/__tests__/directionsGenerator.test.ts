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

  it('should generate directions from steps successfully when accessibilityRequired is true', async () => {
    const steps: RouteStep[] = [
      { nodeId: 'ramp-1', label: 'Ramp 1', distanceToNext: 10, congestionLevel: 'low', requiresAccessibleDetour: true }
    ];
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Go this way without stairs.' }
    });

    const result = await generateDirections(steps, 'en', true);
    expect(result.directions).toBe('Go this way without stairs.');
    expect(result.source).toBe('ai');
    
    // Check that the prompt mentions accessible
    const callArgs = mockGenerateContent.mock.calls[0][0];
    expect(JSON.stringify(callArgs)).toContain('accessible (no stairs) route? Yes');
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

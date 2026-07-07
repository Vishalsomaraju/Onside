import { renderHook, act } from '@testing-library/react';
import { useRoute } from '../hooks/useRoute';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useRoute Hook', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should manage successful fetch states', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, directions: 'Go left', source: 'ai' })
    });

    const { result } = renderHook(() => useRoute());
    
    expect(result.current.loading).toBe(false);
    
    await act(async () => {
      await result.current.fetchRoute({ originId: 'gate-a', query: 'food', matchPhase: 'pre-match', language: 'en' });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.result?.success).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should manage error states on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ reason: 'validation error' })
    });

    const { result } = renderHook(() => useRoute());
    
    await act(async () => {
      await result.current.fetchRoute({ originId: 'gate-a', query: 'food', matchPhase: 'pre-match', language: 'en' });
    });

    expect(result.current.error).toBe('validation error');
    expect(result.current.result).toBeNull();
  });
  
  it('should handle "no route found" gracefully (400 but has directions)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, directions: 'No route found.', source: 'fallback' })
    });

    const { result } = renderHook(() => useRoute());
    
    await act(async () => {
      await result.current.fetchRoute({ originId: 'gate-a', query: 'impossible', matchPhase: 'pre-match', language: 'en' });
    });

    expect(result.current.error).toBeNull();
    expect(result.current.result?.directions).toBe('No route found.');
  });
});

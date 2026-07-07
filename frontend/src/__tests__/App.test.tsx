/// <reference types="vitest-axe/extend-expect" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { axe } from 'vitest-axe';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch as unknown as typeof fetch;

describe('App Integration', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('completes the full query to directions workflow', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        directions: 'AI generated route',
        source: 'ai',
        routeResult: {
          success: true,
          steps: [
            { nodeId: 'gate-a', label: 'Gate A', distanceToNext: 10, congestionLevel: 'low' }
          ]
        }
      })
    });

    render(<App />);
    
    // Initial state
    expect(screen.getByText('Smart Stadiums Router')).toBeInTheDocument();
    
    // Fill out form
    const queryInput = screen.getByLabelText(/What do you need/i);
    fireEvent.change(queryInput, { target: { value: 'bathroom' } });
    
    // Submit
    const button = screen.getByRole('button', { name: /Get Directions/i });
    fireEvent.click(button);
    
    // Wait for result
    await waitFor(() => {
      expect(screen.getByText('AI generated route')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Gate A', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('Gate A', { selector: 'span' })).toBeInTheDocument();
  });

  it('proves restroom/food requests flow through without surfacing an error state', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        directions: 'Go to restroom north',
        source: 'ai',
        routeResult: {
          success: true,
          steps: [
            { nodeId: 'restroom-north', label: 'North Restrooms', distanceToNext: 0, congestionLevel: 'low' }
          ]
        }
      })
    });

    render(<App />);
    
    // Select Restroom 1 from the dropdown
    const originSelect = screen.getByLabelText(/Starting Location/i);
    fireEvent.change(originSelect, { target: { value: 'restroom-north' } });
    
    const queryInput = screen.getByLabelText(/What do you need/i);
    fireEvent.change(queryInput, { target: { value: 'food' } });
    
    const button = screen.getByRole('button', { name: /Get Directions/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Go to restroom north')).toBeInTheDocument();
    });
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should be accessible at root level (no axe violations)', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

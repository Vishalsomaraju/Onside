/// <reference types="vitest-axe/extend-expect" />
import { render, screen } from '@testing-library/react';
import { RouteResult } from '../components/RouteResult';
import { axe } from 'vitest-axe';
import type { DirectionsResponse } from '@smart-stadiums/shared';

describe('RouteResult Component', () => {
  const mockResult: DirectionsResponse = {
    success: true,
    source: 'ai',
    directions: 'Go straight and turn left.',
    routeResult: {
      success: true,
      steps: [
        { nodeId: 'n1', label: 'Start', distanceToNext: 10, congestionLevel: 'low', requiresAccessibleDetour: false }
      ],
      totalDistance: 10
    }
  };

  it('should render directions and steps', () => {
    render(<RouteResult result={mockResult} error={null} isLoading={false} />);
    
    expect(screen.getByText('Go straight and turn left.')).toBeInTheDocument();
    expect(screen.getByText(/Source: AI/i)).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText(/10m/)).toBeInTheDocument();
  });

  it('should render error message', () => {
    render(<RouteResult result={null} error="Failed to fetch" isLoading={false} />);
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
  });

  it('should render visually hidden aria-live announcements', () => {
    const { container } = render(<RouteResult result={null} error={null} isLoading={true} />);
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toHaveTextContent('Fetching route...');
  });

  it('should be accessible (no axe violations)', async () => {
    const { container } = render(<RouteResult result={mockResult} error={null} isLoading={false} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should convey congestion level with text/icon, not just color', () => {
    const { container } = render(<RouteResult result={mockResult} error={null} isLoading={false} />);
    
    // Check that we have a specific congestion indicator element
    const congestionIndicator = container.querySelector('.congestion-indicator');
    expect(congestionIndicator).toBeInTheDocument();
    
    // Must have a textual component or aria-hidden dot (semantic icon)
    const dot = congestionIndicator?.querySelector('.congestion-dot');
    const text = congestionIndicator?.querySelector('.congestion-text');
    
    expect(dot).toBeInTheDocument();
    expect(text).toHaveTextContent(/Low|Medium|High/i);
  });
});

/// <reference types="vitest-axe/extend-expect" />
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryForm } from '../components/QueryForm';
import { axe } from 'vitest-axe';

describe('QueryForm Component', () => {
  it('should render form fields correctly', () => {
    render(<QueryForm onSubmit={vi.fn()} isLoading={false} />);
    
    expect(screen.getByLabelText(/Starting Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/What do you need/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Match Phase/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Language/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Require Accessible Route/i)).toBeInTheDocument();
  });

  it('should disable submit if query is empty', () => {
    render(<QueryForm onSubmit={vi.fn()} isLoading={false} />);
    
    const button = screen.getByRole('button', { name: /Get Directions/i });
    expect(button).toBeDisabled();
  });

  it('should call onSubmit with valid data', () => {
    const handleSubmit = vi.fn();
    render(<QueryForm onSubmit={handleSubmit} isLoading={false} />);
    
    const input = screen.getByLabelText(/What do you need/i);
    fireEvent.change(input, { target: { value: 'hot dog' } });
    
    const button = screen.getByRole('button', { name: /Get Directions/i });
    expect(button).not.toBeDisabled();
    
    fireEvent.click(button);
    
    expect(handleSubmit).toHaveBeenCalledWith({
      originId: 'gate-a',
      query: 'hot dog',
      matchPhase: 'pre-match',
      language: 'en',
      accessibilityRequired: false
    });
  });

  it('should handle changing dropdowns', () => {
    const handleSubmit = vi.fn();
    render(<QueryForm onSubmit={handleSubmit} isLoading={false} />);
    
    fireEvent.change(screen.getByLabelText(/Starting Location/i), { target: { value: 'gate-b' } });
    fireEvent.change(screen.getByLabelText(/Match Phase/i), { target: { value: 'halftime' } });
    fireEvent.change(screen.getByLabelText(/Language/i), { target: { value: 'es' } });
    
    const input = screen.getByLabelText(/What do you need/i);
    fireEvent.change(input, { target: { value: 'baño' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Get Directions/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      originId: 'gate-b',
      query: 'baño',
      matchPhase: 'halftime',
      language: 'es',
      accessibilityRequired: false
    });
  });

  it('should handle accessibility toggle', () => {
    const handleSubmit = vi.fn();
    render(<QueryForm onSubmit={handleSubmit} isLoading={false} />);
    
    const input = screen.getByLabelText(/What do you need/i);
    fireEvent.change(input, { target: { value: 'bathroom' } });
    
    const checkbox = screen.getByLabelText(/Require Accessible Route/i);
    fireEvent.click(checkbox);
    
    fireEvent.click(screen.getByRole('button', { name: /Get Directions/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
      accessibilityRequired: true
    }));
  });

  it('should be accessible (no axe violations)', async () => {
    const { container } = render(<QueryForm onSubmit={vi.fn()} isLoading={false} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should apply distinct visual loading state to submit button', () => {
    const { rerender } = render(<QueryForm onSubmit={vi.fn()} isLoading={false} />);
    
    const button = screen.getByRole('button', { name: /Get Directions/i });
    expect(button).not.toHaveClass('loading-pulse');
    
    rerender(<QueryForm onSubmit={vi.fn()} isLoading={true} />);
    
    expect(button).toHaveClass('loading-pulse');
  });
});

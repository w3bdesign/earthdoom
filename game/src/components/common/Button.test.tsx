import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
    expect(button).not.toBeDisabled();
  });

  it('renders primary variant correctly', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button', { name: /primary/i });
    expect(button).toHaveClass('bg-primary');
  });

  it('renders danger variant correctly', () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole('button', { name: /danger/i });
    expect(button).toHaveClass('bg-danger');
  });

  it('applies disabled state correctly', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('applies extra classes correctly', () => {
    const extraClasses = 'test-class another-class';
    render(<Button extraClasses={extraClasses}>Extra Classes</Button>);
    const button = screen.getByRole('button', { name: /extra classes/i });
    expect(button.className).toContain('test-class');
    expect(button.className).toContain('another-class');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Handler</Button>);
    const button = screen.getByRole('button', { name: /click handler/i });
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger click handler when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled Click</Button>);
    const button = screen.getByRole('button', { name: /disabled click/i });
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies hover and focus styles', () => {
    render(<Button>Style Test</Button>);
    const button = screen.getByRole('button', { name: /style test/i });
    const className = button.className;
    expect(className).toContain('hover:bg-primary-600');
    expect(className).toContain('focus:bg-primary-600');
  });

  it('spreads additional props to button element', () => {
    render(
      <Button data-testid="test-button" aria-label="test button">
        Props Spread
      </Button>
    );
    const button = screen.getByTestId('test-button');
    expect(button).toHaveAttribute('aria-label', 'test button');
  });

  it('maintains consistent styling with long text content', () => {
    render(
      <Button>
        This is a very long button text that should still maintain proper styling
      </Button>
    );
    const button = screen.getByRole('button');
    const className = button.className;
    expect(className).toContain('p-8');
    expect(className).toContain('w-32');
    expect(className).toContain('pb-2');
    expect(className).toContain('pt-2.5');
  });

  it('combines all style classes correctly', () => {
    render(<Button variant="primary" extraClasses="custom-class">Test</Button>);
    const button = screen.getByRole('button');
    const className = button.className;
    
    // Base classes
    expect(className).toContain('inline-block');
    expect(className).toContain('rounded');
    expect(className).toContain('text-white');
    
    // Variant classes
    expect(className).toContain('bg-primary');
    
    // Extra classes
    expect(className).toContain('custom-class');
    
    // Interactive states
    expect(className).toContain('disabled:opacity-50');
    expect(className).toContain('hover:bg-primary-600');
    expect(className).toContain('focus:bg-primary-600');
  });
});

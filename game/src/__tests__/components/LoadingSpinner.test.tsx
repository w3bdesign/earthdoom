import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../../components/common/Loader/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders an SVG element', () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has aria-hidden attribute on SVG for accessibility', () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a screen-reader-only loading text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies sr-only class to the loading text for accessibility', () => {
    render(<LoadingSpinner />);
    const loadingText = screen.getByText('Loading...');
    expect(loadingText).toHaveClass('sr-only');
  });

  it('applies animation class to the SVG', () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('animate-spin');
  });

  it('renders two path elements inside SVG', () => {
    const { container } = render(<LoadingSpinner />);
    const paths = container.querySelectorAll('svg path');
    expect(paths.length).toBe(2);
  });
});

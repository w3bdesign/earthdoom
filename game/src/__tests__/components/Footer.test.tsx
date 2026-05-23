import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/common/Layout/Footer';

describe('Footer', () => {
  it('renders the footer element', () => {
    render(<Footer />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/Copyright killaH/)).toBeInTheDocument();
  });

  it('renders the current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  it('has aria-label for accessibility', () => {
    render(<Footer />);
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveAttribute(
      'aria-label',
      'Innholdet for bunnteksten med copyright'
    );
  });

  it('has fixed bottom positioning class', () => {
    render(<Footer />);
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveClass('fixed');
    expect(footer).toHaveClass('bottom-0');
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import Error from '../../pages/error';

jest.mock('../../components/common/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

describe('Error page', () => {
  it('renders the error page with layout', () => {
    render(<Error />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders "Error page" text', () => {
    render(<Error />);
    expect(screen.getByText('Error page')).toBeInTheDocument();
  });
});

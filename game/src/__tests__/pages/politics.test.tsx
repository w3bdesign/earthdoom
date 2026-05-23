import React from 'react';
import { render, screen } from '@testing-library/react';
import Politics from '../../pages/politics';

jest.mock('../../components/common/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

describe('Politics page', () => {
  it('renders the politics page with layout', () => {
    render(<Politics />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    const { container } = render(<Politics />);
    expect(container).not.toBeEmptyDOMElement();
  });
});

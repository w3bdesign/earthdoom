import React from 'react';
import { render, screen } from '@testing-library/react';
import PageShell from '../../components/common/PageShell';

jest.mock('../../components/common/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

jest.mock('../../components/common/Loader/LoadingSpinner', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

const createPlayer = (overrides = {}) => ({
  id: 1, nick: 'Test', crystal: 5000, metal: 3000, energy: 1000,
  r_energy: 0, ui_roids: 3, score: 100, size: 10, rank: 1, tag: '',
  c_airport: 0, c_crystal: 0, c_metal: 0, c_abase: 0, c_wstation: 0,
  c_amp1: 0, c_amp2: 0, c_warfactory: 0, c_destfact: 0, c_scorpfact: 0,
  c_energy: 0, c_odg: 0, r_imcrystal: 0, r_immetal: 0,
  ...overrides,
});

describe('PageShell', () => {
  it('renders null when not authenticated and showSpinnerOnUnauthenticated is false', () => {
    const { container } = render(
      <PageShell isAuthenticated={false} paPlayer={null}>
        <div>Content</div>
      </PageShell>
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders spinner when not authenticated and showSpinnerOnUnauthenticated is true', () => {
    render(
      <PageShell isAuthenticated={false} paPlayer={null} showSpinnerOnUnauthenticated>
        <div>Content</div>
      </PageShell>
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders loading spinner when authenticated but no player data', () => {
    render(
      <PageShell isAuthenticated={true} paPlayer={null}>
        <div>Content</div>
      </PageShell>
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders children inside Layout when authenticated with player data', () => {
    render(
      <PageShell isAuthenticated={true} paPlayer={createPlayer()}>
        <div data-testid="child-content">Hello</div>
      </PageShell>
    );
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});

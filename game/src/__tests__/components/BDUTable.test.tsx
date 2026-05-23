import React from 'react';
import { render, screen } from '@testing-library/react';
import BDUTable from '../../components/ui/tables/BDUTable';
import { createMockPaPlayer } from '../../test-utils/players';

describe('BDUTable', () => {
  it('renders the caption with total BDU count', () => {
    const player = createMockPaPlayer({
      rcannons: 5,
      avengers: 3,
      lstalkers: 2,
    });
    render(<BDUTable paPlayer={player} />);
    expect(screen.getByText('BDU (10 total)')).toBeInTheDocument();
  });

  it('renders caption with 0 total when no BDU units', () => {
    const player = createMockPaPlayer({
      rcannons: 0,
      avengers: 0,
      lstalkers: 0,
    });
    render(<BDUTable paPlayer={player} />);
    expect(screen.getByText('BDU (0 total)')).toBeInTheDocument();
  });

  it('renders all BDU column headers', () => {
    const player = createMockPaPlayer();
    render(<BDUTable paPlayer={player} />);
    expect(screen.getByText('Reaper cannons')).toBeInTheDocument();
    expect(screen.getByText('Avengers')).toBeInTheDocument();
    expect(screen.getByText('Lucius stalkers')).toBeInTheDocument();
  });

  it('renders BDU values correctly', () => {
    const player = createMockPaPlayer({
      rcannons: 8,
      avengers: 6,
      lstalkers: 4,
    });
    render(<BDUTable paPlayer={player} />);
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('renders a table element', () => {
    const player = createMockPaPlayer();
    const { container } = render(<BDUTable paPlayer={player} />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('calculates total correctly with large numbers', () => {
    const player = createMockPaPlayer({
      rcannons: 100,
      avengers: 200,
      lstalkers: 300,
    });
    render(<BDUTable paPlayer={player} />);
    expect(screen.getByText('BDU (600 total)')).toBeInTheDocument();
  });
});

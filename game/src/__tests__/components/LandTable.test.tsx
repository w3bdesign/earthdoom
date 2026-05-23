import React from 'react';
import { render, screen } from '@testing-library/react';
import LandTable from '../../components/ui/tables/LandTable';
import { createMockPaPlayer } from '../../test-utils/players';

describe('LandTable', () => {
  it('renders the caption with total land count', () => {
    const player = createMockPaPlayer({
      asteroid_metal: 10,
      asteroid_crystal: 8,
      ui_roids: 5,
    });
    render(<LandTable paPlayer={player} />);
    expect(screen.getByText('Land (23 total)')).toBeInTheDocument();
  });

  it('renders caption with 0 total when no land', () => {
    const player = createMockPaPlayer({
      asteroid_metal: 0,
      asteroid_crystal: 0,
      ui_roids: 0,
    });
    render(<LandTable paPlayer={player} />);
    expect(screen.getByText('Land (0 total)')).toBeInTheDocument();
  });

  it('renders all land column headers', () => {
    const player = createMockPaPlayer();
    render(<LandTable paPlayer={player} />);
    expect(screen.getByText('Mines')).toBeInTheDocument();
    expect(screen.getByText('Houses')).toBeInTheDocument();
    expect(screen.getByText('Undeveloped')).toBeInTheDocument();
  });

  it('renders land values correctly', () => {
    const player = createMockPaPlayer({
      asteroid_metal: 12,
      asteroid_crystal: 7,
      ui_roids: 4,
    });
    render(<LandTable paPlayer={player} />);
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('renders a table element', () => {
    const player = createMockPaPlayer();
    const { container } = render(<LandTable paPlayer={player} />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });
});

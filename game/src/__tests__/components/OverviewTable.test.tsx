import React from 'react';
import { render, screen } from '@testing-library/react';
import OverviewTable from '../../components/common/Header/OverviewTable';
import { createMockPaPlayer } from '../../test-utils/players';

describe('OverviewTable', () => {
  it('renders the caption with player nick', () => {
    const player = createMockPaPlayer({ nick: 'TestUser' });
    render(<OverviewTable paPlayer={player} />);
    expect(screen.getByText('Overview for TestUser')).toBeInTheDocument();
  });

  it('renders all overview column headers', () => {
    const player = createMockPaPlayer();
    render(<OverviewTable paPlayer={player} />);
    expect(screen.getByText('Crystal')).toBeInTheDocument();
    expect(screen.getByText('Titanium')).toBeInTheDocument();
    expect(screen.getByText('Energy')).toBeInTheDocument();
    expect(screen.getByText('Houses')).toBeInTheDocument();
    expect(screen.getByText('Mines')).toBeInTheDocument();
    expect(screen.getByText('Undeveloped')).toBeInTheDocument();
    expect(screen.getByText('Rank')).toBeInTheDocument();
  });

  it('renders player resource values', () => {
    const player = createMockPaPlayer({
      crystal: 7500,
      metal: 4200,
      energy: 1800,
      asteroid_crystal: 12,
      asteroid_metal: 8,
      ui_roids: 6,
      rank: 3,
    });
    render(<OverviewTable paPlayer={player} />);
    expect(screen.getByText('7500')).toBeInTheDocument();
    expect(screen.getByText('4200')).toBeInTheDocument();
    expect(screen.getByText('1800')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders a table element', () => {
    const player = createMockPaPlayer();
    const { container } = render(<OverviewTable paPlayer={player} />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('renders caption with default nick from mock', () => {
    const player = createMockPaPlayer();
    render(<OverviewTable paPlayer={player} />);
    expect(screen.getByText('Overview for TestPlayer')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import FleetTable from '../../components/ui/tables/FleetTable';
import { createMockPaUser } from '../../test-utils/players';

interface UseQueryReturn {
  data: { nick: string; id: number } | null | undefined;
  isLoading: boolean;
}

const mockGetAttackedPlayer = jest.fn<UseQueryReturn, []>();
const mockGetDefendedPlayer = jest.fn<UseQueryReturn, []>();

jest.mock('../../utils/api', () => ({
  api: {
    paUsers: {
      getAttackedPlayer: {
        useQuery: () => mockGetAttackedPlayer(),
      },
      getDefendedPlayer: {
        useQuery: () => mockGetDefendedPlayer(),
      },
    },
  },
}));

jest.mock('../../components/common/Loader/LoadingSpinner', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe('FleetTable', () => {
  beforeEach(() => {
    mockGetAttackedPlayer.mockClear();
    mockGetDefendedPlayer.mockClear();
  });

  it('renders "All fleets at home" when war=0 and def=0', () => {
    mockGetAttackedPlayer.mockReturnValue({ data: null, isLoading: false });
    mockGetDefendedPlayer.mockReturnValue({ data: null, isLoading: false });

    const player = createMockPaUser({ war: 0, def: 0 });
    render(<FleetTable paPlayer={player} />);

    expect(screen.getByText('All fleets at home')).toBeInTheDocument();
  });

  it('renders "Returning" message when war is negative', () => {
    mockGetAttackedPlayer.mockReturnValue({ data: null, isLoading: false });
    mockGetDefendedPlayer.mockReturnValue({ data: null, isLoading: false });

    const player = createMockPaUser({ war: -1, def: 0, wareta: 3 });
    render(<FleetTable paPlayer={player} />);

    expect(screen.getByText('Returning ... ETA 3')).toBeInTheDocument();
  });

  it('renders "Attacking" message with calculated ETA when wareta >= 5', () => {
    mockGetAttackedPlayer.mockReturnValue({
      data: { nick: 'EnemyPlayer', id: 42 },
      isLoading: false,
    });
    mockGetDefendedPlayer.mockReturnValue({ data: null, isLoading: false });

    const player = createMockPaUser({ war: 42, def: 0, wareta: 8 });
    render(<FleetTable paPlayer={player} />);

    expect(
      screen.getByText(/Attacking EnemyPlayer #42.*ETA: 3 ticks/)
    ).toBeInTheDocument();
  });

  it('renders "Attacking" with ETA 0 when wareta < 5', () => {
    mockGetAttackedPlayer.mockReturnValue({
      data: { nick: 'EnemyPlayer', id: 42 },
      isLoading: false,
    });
    mockGetDefendedPlayer.mockReturnValue({ data: null, isLoading: false });

    const player = createMockPaUser({ war: 42, def: 0, wareta: 3 });
    render(<FleetTable paPlayer={player} />);

    expect(
      screen.getByText(/Attacking EnemyPlayer #42.*ETA: 0 ticks/)
    ).toBeInTheDocument();
  });

  it('renders "Defending" message with calculated ETA when wareta >= 5', () => {
    mockGetAttackedPlayer.mockReturnValue({ data: null, isLoading: false });
    mockGetDefendedPlayer.mockReturnValue({
      data: { nick: 'AllyPlayer', id: 7 },
      isLoading: false,
    });

    const player = createMockPaUser({ war: 0, def: 7, wareta: 10 });
    render(<FleetTable paPlayer={player} />);

    expect(
      screen.getByText(/Defending AllyPlayer #7.*ETA: 5 ticks/)
    ).toBeInTheDocument();
  });

  it('renders "Defending" with ETA 0 when wareta < 5', () => {
    mockGetAttackedPlayer.mockReturnValue({ data: null, isLoading: false });
    mockGetDefendedPlayer.mockReturnValue({
      data: { nick: 'AllyPlayer', id: 7 },
      isLoading: false,
    });

    const player = createMockPaUser({ war: 0, def: 7, wareta: 2 });
    render(<FleetTable paPlayer={player} />);

    expect(
      screen.getByText(/Defending AllyPlayer #7.*ETA: 0 ticks/)
    ).toBeInTheDocument();
  });

  it('renders Fleet status heading', () => {
    mockGetAttackedPlayer.mockReturnValue({ data: null, isLoading: false });
    mockGetDefendedPlayer.mockReturnValue({ data: null, isLoading: false });

    const player = createMockPaUser();
    render(<FleetTable paPlayer={player} />);

    expect(screen.getByText('Fleet status')).toBeInTheDocument();
  });

  it('renders loading spinner when data is loading', () => {
    mockGetAttackedPlayer.mockReturnValue({ data: null, isLoading: true });
    mockGetDefendedPlayer.mockReturnValue({ data: null, isLoading: false });

    const player = createMockPaUser({ war: 5 });
    render(<FleetTable paPlayer={player} />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders empty string when war > 0 but no attack target loaded', () => {
    mockGetAttackedPlayer.mockReturnValue({ data: null, isLoading: false });
    mockGetDefendedPlayer.mockReturnValue({ data: null, isLoading: false });

    const player = createMockPaUser({ war: 5, def: 0 });
    render(<FleetTable paPlayer={player} />);

    // Should not crash, renders empty status
    expect(screen.getByText('Fleet status')).toBeInTheDocument();
  });
});

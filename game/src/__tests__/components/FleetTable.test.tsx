import React from 'react';
import { render, screen } from '@testing-library/react';
import FleetTable from '../../components/ui/tables/FleetTable';
import type { PaUsers } from '@prisma/client';

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

const createMockPlayer = (overrides: Partial<PaUsers> = {}): PaUsers => ({
  id: 1,
  nick: 'TestPlayer',
  crystal: 5000,
  metal: 3000,
  energy: 1000,
  r_energy: 0,
  sats: 0,
  infinitys: 0,
  wraiths: 0,
  warfrigs: 0,
  destroyers: 0,
  scorpions: 0,
  astropods: 0,
  cobras: 0,
  infinitys_base: 0,
  wraiths_base: 0,
  warfrigs_base: 0,
  destroyers_base: 0,
  scorpions_base: 0,
  astropods_base: 0,
  cobras_base: 0,
  p_scorpions: 0,
  p_scorpions_eta: 0,
  p_cobras: 0,
  p_cobras_eta: 0,
  missiles: 0,
  score: 100,
  asteroids: 10,
  asteroid_crystal: 5,
  asteroid_metal: 5,
  ui_roids: 3,
  war: 0,
  def: 0,
  wareta: 0,
  defeta: 0,
  r_imcrystal: 0,
  r_immetal: 0,
  r_iafs: 0,
  r_aaircraft: 0,
  r_tbeam: 0,
  r_uscan: 0,
  r_oscan: 0,
  p_infinitys: 0,
  p_infinitys_eta: 0,
  p_wraiths: 0,
  p_wraiths_eta: 0,
  p_warfrigs: 0,
  p_warfrigs_eta: 0,
  p_destroyers: 0,
  p_destroyers_eta: 0,
  p_missiles: 0,
  p_missiles_eta: 0,
  timer: 0,
  size: 10,
  p_astropods: 0,
  p_astropods_eta: 0,
  tag: '',
  rank: 1,
  rcannons: 0,
  p_rcannons: 0,
  p_rcannons_eta: 0,
  avengers: 0,
  p_avengers: 0,
  p_avengers_eta: 0,
  lstalkers: 0,
  p_lstalkers: 0,
  p_lstalkers_eta: 0,
  r_odg: 0,
  sleep: 0,
  lastsleep: 0,
  closed: 0,
  x: 1,
  y: 1,
  commander: 0,
  galname: 'No name',
  galpic: '125x125earthdoom1.gif',
  motd: 0,
  vote: '',
  civilians: 1000,
  tax: 20,
  credits: 5000,
  newbie: 100,
  paConstructId: null,
  ...overrides,
});

describe('FleetTable', () => {
  beforeEach(() => {
    mockGetAttackedPlayer.mockClear();
    mockGetDefendedPlayer.mockClear();
  });

  it('renders "All fleets at home" when war=0 and def=0', () => {
    mockGetAttackedPlayer.mockReturnValue({ data: null, isLoading: false });
    mockGetDefendedPlayer.mockReturnValue({ data: null, isLoading: false });

    const player = createMockPlayer({ war: 0, def: 0 });
    render(<FleetTable paPlayer={player} />);

    expect(screen.getByText('All fleets at home')).toBeInTheDocument();
  });

  it('renders "Returning" message when war is negative', () => {
    mockGetAttackedPlayer.mockReturnValue({ data: null, isLoading: false });
    mockGetDefendedPlayer.mockReturnValue({ data: null, isLoading: false });

    const player = createMockPlayer({ war: -1, def: 0, wareta: 3 });
    render(<FleetTable paPlayer={player} />);

    expect(screen.getByText('Returning ... ETA 3')).toBeInTheDocument();
  });

  it('renders "Attacking" message with ETA when attacking', () => {
    mockGetAttackedPlayer.mockReturnValue({
      data: { nick: 'EnemyPlayer', id: 42 },
      isLoading: false,
    });
    mockGetDefendedPlayer.mockReturnValue({ data: null, isLoading: false });

    const player = createMockPlayer({ war: 42, def: 0, wareta: 8 });
    render(<FleetTable paPlayer={player} />);

    expect(
      screen.getByText('Attacking EnemyPlayer #42 (ETA: 3 ticks)')
    ).toBeInTheDocument();
  });

  it('renders "Attacking" with ETA 0 when wareta < 5', () => {
    mockGetAttackedPlayer.mockReturnValue({
      data: { nick: 'EnemyPlayer', id: 42 },
      isLoading: false,
    });
    mockGetDefendedPlayer.mockReturnValue({ data: null, isLoading: false });

    const player = createMockPlayer({ war: 42, def: 0, wareta: 3 });
    render(<FleetTable paPlayer={player} />);

    expect(
      screen.getByText('Attacking EnemyPlayer #42 (ETA: 0 ticks)')
    ).toBeInTheDocument();
  });

  it('renders "Defending" message with ETA when defending', () => {
    mockGetAttackedPlayer.mockReturnValue({ data: null, isLoading: false });
    mockGetDefendedPlayer.mockReturnValue({
      data: { nick: 'AllyPlayer', id: 7 },
      isLoading: false,
    });

    const player = createMockPlayer({ war: 0, def: 7, wareta: 10 });
    render(<FleetTable paPlayer={player} />);

    expect(
      screen.getByText('Defending AllyPlayer #7 (ETA: 5 ticks)')
    ).toBeInTheDocument();
  });

  it('renders "Defending" with ETA 0 when wareta < 5', () => {
    mockGetAttackedPlayer.mockReturnValue({ data: null, isLoading: false });
    mockGetDefendedPlayer.mockReturnValue({
      data: { nick: 'AllyPlayer', id: 7 },
      isLoading: false,
    });

    const player = createMockPlayer({ war: 0, def: 7, wareta: 2 });
    render(<FleetTable paPlayer={player} />);

    expect(
      screen.getByText('Defending AllyPlayer #7 (ETA: 0 ticks)')
    ).toBeInTheDocument();
  });

  it('renders Fleet status heading', () => {
    mockGetAttackedPlayer.mockReturnValue({ data: null, isLoading: false });
    mockGetDefendedPlayer.mockReturnValue({ data: null, isLoading: false });

    const player = createMockPlayer();
    render(<FleetTable paPlayer={player} />);

    expect(screen.getByText('Fleet status')).toBeInTheDocument();
  });
});

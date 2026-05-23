import React from 'react';
import { render, screen } from '@testing-library/react';
import Construction from '../../pages/construct';
import type { PaUsers } from '@prisma/client';

interface UseUserReturn {
  isSignedIn: boolean;
  user: { username: string | null } | null;
}

interface UseMutationReturn {
  mutate: jest.Mock;
  isLoading: boolean;
}

interface UseQueryReturn {
  data: PaUsers | null | undefined;
  isLoading: boolean;
}

const mockUseUser = jest.fn<UseUserReturn, []>();
const mockUseQuery = jest.fn<UseQueryReturn, []>();
const mockUseMutation = jest.fn<UseMutationReturn, []>();

jest.mock('@clerk/nextjs', () => ({
  useUser: () => mockUseUser(),
}));

jest.mock('../../utils/api', () => ({
  api: {
    useContext: () => ({
      paUsers: {
        getPlayerByNick: {
          invalidate: jest.fn(),
          refetch: jest.fn(),
        },
      },
    }),
    paUsers: {
      getPlayerByNick: {
        useQuery: () => mockUseQuery(),
      },
    },
    paConstruct: {
      constructBuilding: {
        useMutation: () => mockUseMutation(),
      },
    },
  },
}));

jest.mock('../../components/common/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

jest.mock('../../components/common/Loader/LoadingSpinner', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

jest.mock('../../components/ui', () => ({
  Button: () => <button data-testid="button">Button</button>,
  AdvancedDataTable: () => <div data-testid="advanced-data-table">Table</div>,
  ToastComponent: jest.fn(),
}));

jest.mock('../../components/features/Construct/constants/BUILDINGS', () => ({
  BUILDINGS: [],
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

describe('Construction page', () => {
  let capturedMutationOpts: { onSuccess?: () => Promise<void>; onError?: () => void } = {};

  beforeEach(() => {
    mockUseUser.mockClear();
    mockUseQuery.mockClear();
    mockUseMutation.mockClear();
    mockUseMutation.mockImplementation((opts) => {
      capturedMutationOpts = opts as typeof capturedMutationOpts;
      return { mutate: jest.fn(), isLoading: false };
    });
  });

  it('returns null when user is not signed in', () => {
    mockUseUser.mockReturnValue({ isSignedIn: false, user: null });
    mockUseQuery.mockReturnValue({ data: null, isLoading: false });

    const { container } = render(<Construction />);
    expect(container.innerHTML).toBe('');
  });

  it('renders loading spinner when player data is not loaded', () => {
    mockUseUser.mockReturnValue({ isSignedIn: true, user: { username: 'TestPlayer' } });
    mockUseQuery.mockReturnValue({ data: null, isLoading: true });

    render(<Construction />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders AdvancedDataTable when player data is loaded', () => {
    mockUseUser.mockReturnValue({ isSignedIn: true, user: { username: 'TestPlayer' } });
    const player = createMockPlayer();
    mockUseQuery.mockReturnValue({ data: player, isLoading: false });

    render(<Construction />);
    expect(screen.getByTestId('advanced-data-table')).toBeInTheDocument();
  });

  it('renders within Layout when player data is available', () => {
    mockUseUser.mockReturnValue({ isSignedIn: true, user: { username: 'TestPlayer' } });
    const player = createMockPlayer();
    mockUseQuery.mockReturnValue({ data: player, isLoading: false });

    render(<Construction />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });
});

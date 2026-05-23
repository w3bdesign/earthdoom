import React from 'react';
import { render, screen } from '@testing-library/react';
import RankingPage from '../../pages/ranking';

const mockUsePlayerData = jest.fn();
jest.mock('../../utils/usePlayerData', () => ({
  usePlayerData: () => mockUsePlayerData(),
}));

const mockGetAll = jest.fn();
jest.mock('../../utils/api', () => ({
  api: {
    paUsers: {
      getAll: { useQuery: () => mockGetAll() },
    },
  },
}));

jest.mock('../../components/common/PageShell', () => ({
  __esModule: true,
  default: ({ isAuthenticated, paPlayer, children }: { isAuthenticated: boolean; paPlayer: unknown; children: React.ReactNode }) => {
    if (!isAuthenticated) return <div data-testid="not-authenticated" />;
    if (!paPlayer) return <div data-testid="loading" />;
    return <div data-testid="page-shell">{children}</div>;
  },
}));

jest.mock('../../components/ui', () => ({
  AdvancedDataTable: ({ caption }: { caption: string }) => <div data-testid="data-table">{caption}</div>,
}));

jest.mock('../../components/ui/tables/RankingActions', () => ({
  __esModule: true,
  default: () => <div data-testid="ranking-actions">Actions</div>,
}));

const createPlayer = (overrides = {}) => ({
  id: 1, nick: 'Test', crystal: 5000, metal: 3000, energy: 1000,
  r_energy: 0, ui_roids: 3, score: 100, size: 10, rank: 1, tag: '',
  c_airport: 0, c_crystal: 0, c_metal: 0,
  ...overrides,
});

describe('Ranking page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAll.mockReturnValue({ data: null, isLoading: false });
  });

  it('renders not-authenticated when user is not logged in', () => {
    mockUsePlayerData.mockReturnValue({ paPlayer: null, isAuthenticated: false, isSignedIn: false, user: null });
    render(<RankingPage />);
    expect(screen.getByTestId('not-authenticated')).toBeInTheDocument();
  });

  it('renders loading when player data is null', () => {
    mockUsePlayerData.mockReturnValue({ paPlayer: null, isAuthenticated: true, isSignedIn: true, user: { username: 'Test' } });
    render(<RankingPage />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders AdvancedDataTable when player and ranking data are loaded', () => {
    const rankings = [createPlayer(), createPlayer({ id: 2, nick: 'Player2' })];
    mockUsePlayerData.mockReturnValue({ paPlayer: createPlayer(), isAuthenticated: true, isSignedIn: true, user: { username: 'Test' } });
    mockGetAll.mockReturnValue({ data: rankings, isLoading: false });
    render(<RankingPage />);
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByTestId('data-table')).toHaveTextContent('Player ranking');
  });

  it('does not render table when ranking data is null', () => {
    mockUsePlayerData.mockReturnValue({ paPlayer: createPlayer(), isAuthenticated: true, isSignedIn: true, user: { username: 'Test' } });
    mockGetAll.mockReturnValue({ data: null, isLoading: true });
    render(<RankingPage />);
    expect(screen.queryByTestId('data-table')).not.toBeInTheDocument();
  });
});

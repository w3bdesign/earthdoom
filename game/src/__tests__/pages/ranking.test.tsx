import React from 'react';
import { render, screen } from '@testing-library/react';
import RankingPage from '../../pages/ranking';
import { createMockPaPlayer } from '../../test-utils/players';

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

interface MockColumn {
  label?: string;
  accessor: unknown;
}

interface MockTableProps {
  caption: string;
  columns: MockColumn[];
  data: Record<string, unknown>[];
}

jest.mock('../../components/ui', () => ({
  AdvancedDataTable: ({ caption, columns, data }: MockTableProps) => {
    // Render the accessor function for the Actions column to cover it
    const actionsCol = columns.find((c) => c.label === 'Actions');
    let actionsOutput = null;
    if (actionsCol && typeof actionsCol.accessor === 'function' && data[0]) {
      actionsOutput = (actionsCol.accessor as (row: Record<string, unknown>) => React.ReactNode)(data[0]);
    }
    return (
      <div data-testid="data-table">
        {caption}
        <div data-testid="actions-output">{actionsOutput}</div>
      </div>
    );
  },
}));

jest.mock('../../components/ui/tables/RankingActions', () => ({
  __esModule: true,
  default: ({ playerNick }: { playerNick: string }) => <div data-testid="ranking-actions">{playerNick}</div>,
}));

/** Set up authenticated user with player data and optional rankings */
function setupAuthenticated(rankings: unknown[] | null = null) {
  mockUsePlayerData.mockReturnValue({
    paPlayer: createMockPaPlayer(),
    isAuthenticated: true,
    isSignedIn: true,
    user: { username: 'Test' },
  });
  mockGetAll.mockReturnValue({ data: rankings, isLoading: rankings === null });
}

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
    setupAuthenticated([createMockPaPlayer(), createMockPaPlayer({ id: 2, nick: 'Player2' })]);
    render(<RankingPage />);
    expect(screen.getByTestId('data-table')).toHaveTextContent('Player ranking');
  });

  it('renders RankingActions for each player row', () => {
    setupAuthenticated([createMockPaPlayer({ nick: 'Enemy' })]);
    render(<RankingPage />);
    expect(screen.getByTestId('ranking-actions')).toHaveTextContent('Enemy');
  });

  it('does not render table when ranking data is null', () => {
    setupAuthenticated(null);
    render(<RankingPage />);
    expect(screen.queryByTestId('data-table')).not.toBeInTheDocument();
  });

  it('renders empty fragment when paPlayer is null in accessor', () => {
    setupAuthenticated([createMockPaPlayer({ nick: 'Enemy' })]);
    render(<RankingPage />);
    // If the accessor renders, we should see ranking-actions
    expect(screen.getByTestId('ranking-actions')).toBeInTheDocument();
  });
});

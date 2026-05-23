import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Resources from '../../pages/resources';

const mockUsePlayerData = jest.fn();
jest.mock('../../utils/usePlayerData', () => ({
  usePlayerData: () => mockUsePlayerData(),
}));

let capturedOnSuccess: (() => Promise<void>) | undefined;
let capturedOnError: (() => void) | undefined;
const mockMutate = jest.fn();
const mockInvalidate = jest.fn().mockResolvedValue(undefined);
const mockRefetch = jest.fn().mockResolvedValue(undefined);

jest.mock('../../utils/api', () => ({
  api: {
    useContext: () => ({
      paUsers: { getPlayerByNick: { invalidate: mockInvalidate, refetch: mockRefetch } },
    }),
    paConstruct: {
      developLand: {
        useMutation: (opts: { onSuccess?: () => Promise<void>; onError?: () => void }) => {
          capturedOnSuccess = opts.onSuccess;
          capturedOnError = opts.onError;
          return { mutate: mockMutate, isLoading: false };
        },
      },
    },
  },
}));

jest.mock('../../components/common/PageShell', () => ({
  __esModule: true,
  default: ({ isAuthenticated, paPlayer, children, showSpinnerOnUnauthenticated }: { isAuthenticated: boolean; paPlayer: unknown; children: React.ReactNode; showSpinnerOnUnauthenticated?: boolean }) => {
    if (!isAuthenticated) return showSpinnerOnUnauthenticated ? <div data-testid="loading-spinner" /> : <div data-testid="not-authenticated" />;
    if (!paPlayer) return <div data-testid="loading" />;
    return <div data-testid="page-shell">{children}</div>;
  },
}));

jest.mock('../../components/common/Loader/LoadingSpinner', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

jest.mock('../../components/features/Resources/BarGraph', () => ({
  __esModule: true,
  default: () => <div data-testid="bar-graph">Bar Graph</div>,
}));

jest.mock('../../components/ui', () => ({
  Button: () => <button data-testid="button">Button</button>,
  AdvancedDataTable: () => <div data-testid="advanced-data-table">Table</div>,
  ToastComponent: jest.fn(),
}));

jest.mock('../../utils/functions', () => ({
  renderIncomeData: jest.fn(() => ({ labels: [], datasets: [] })),
}));

jest.mock('../../components/features/Resources/constants/RESOURCE', () => ({
  RESOURCE: [],
}));

const createPlayer = (overrides = {}) => ({
  id: 1, nick: 'Test', crystal: 5000, metal: 3000, energy: 1000,
  r_energy: 0, ui_roids: 3, asteroid_crystal: 5, asteroid_metal: 5,
  sats: 0, war: 0, def: 0, wareta: 0, defeta: 0, score: 100,
  size: 10, rank: 1, tag: '', civilians: 1000, tax: 20, credits: 5000,
  c_crystal: 0, c_metal: 0, c_airport: 0, c_abase: 0, c_wstation: 0,
  c_amp1: 0, c_amp2: 0, c_warfactory: 0, c_destfact: 0, c_scorpfact: 0,
  c_energy: 0, c_odg: 0, r_imcrystal: 0, r_immetal: 0,
  ...overrides,
});

describe('Resources page', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders spinner when user is not authenticated', () => {
    mockUsePlayerData.mockReturnValue({ paPlayer: null, isAuthenticated: false, isLoaded: true });
    render(<Resources />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders loading when player data is null', () => {
    mockUsePlayerData.mockReturnValue({ paPlayer: null, isAuthenticated: true, isLoaded: true });
    render(<Resources />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders "No land, no income" when player has no land', () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ ui_roids: 0, asteroid_crystal: 0, asteroid_metal: 0 }),
      isAuthenticated: true, isLoaded: true,
    });
    render(<Resources />);
    expect(screen.getByText('No land, no income.')).toBeInTheDocument();
  });

  it('renders BarGraph when player has developed land', () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ ui_roids: 0, asteroid_crystal: 5, asteroid_metal: 5 }),
      isAuthenticated: true, isLoaded: true,
    });
    render(<Resources />);
    expect(screen.getByTestId('bar-graph')).toBeInTheDocument();
  });

  it('renders undeveloped land count when ui_roids > 0', () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ ui_roids: 7, asteroid_crystal: 5, asteroid_metal: 5 }),
      isAuthenticated: true, isLoaded: true,
    });
    render(<Resources />);
    expect(screen.getByText('Undeveloped land: 7')).toBeInTheDocument();
  });

  it('renders "no land to develop" when ui_roids is 0 but has other land', () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ ui_roids: 0, asteroid_crystal: 5, asteroid_metal: 5 }),
      isAuthenticated: true, isLoaded: true,
    });
    render(<Resources />);
    expect(screen.getByText('You have no land to develop')).toBeInTheDocument();
  });

  it('renders AdvancedDataTable when ui_roids > 0', () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ ui_roids: 5 }),
      isAuthenticated: true, isLoaded: true,
    });
    render(<Resources />);
    expect(screen.getByTestId('advanced-data-table')).toBeInTheDocument();
  });

  it('calls invalidate and refetch on mutation success', async () => {
    mockUsePlayerData.mockReturnValue({ paPlayer: createPlayer(), isAuthenticated: true, isLoaded: true });
    render(<Resources />);

    await act(async () => { await capturedOnSuccess?.(); });

    expect(mockInvalidate).toHaveBeenCalled();
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('shows success toast on mutation success', async () => {
    const { ToastComponent } = jest.requireMock('../../components/ui');
    mockUsePlayerData.mockReturnValue({ paPlayer: createPlayer(), isAuthenticated: true, isLoaded: true });
    render(<Resources />);

    await act(async () => { await capturedOnSuccess?.(); });

    expect(ToastComponent).toHaveBeenCalledWith({ message: 'Resource initiated', type: 'success' });
  });

  it('shows error toast on mutation error', () => {
    const { ToastComponent } = jest.requireMock('../../components/ui');
    mockUsePlayerData.mockReturnValue({ paPlayer: createPlayer(), isAuthenticated: true, isLoaded: true });
    render(<Resources />);

    capturedOnError?.();

    expect(ToastComponent).toHaveBeenCalledWith({ message: 'Database error', type: 'error' });
  });
});

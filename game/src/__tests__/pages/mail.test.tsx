import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import Mail from '../../pages/mail';

const mockUsePlayerData = jest.fn();
jest.mock('../../utils/usePlayerData', () => ({
  usePlayerData: () => mockUsePlayerData(),
}));

let capturedMarkSeenOnSuccess: (() => Promise<void>) | undefined;
let capturedMarkSeenOnError: (() => void) | undefined;
const mockMarkAsSeen = jest.fn();
const mockGetAllMail = jest.fn();
const mockInvalidate = jest.fn().mockResolvedValue(undefined);
const mockRefetch = jest.fn().mockResolvedValue(undefined);

jest.mock('../../utils/api', () => ({
  api: {
    useContext: () => ({
      paMail: { getAllMailByNick: { invalidate: mockInvalidate, refetch: mockRefetch } },
    }),
    paMail: {
      getAllMailByNick: { useQuery: () => mockGetAllMail() },
      markAsSeen: {
        useMutation: (opts: { onSuccess?: () => Promise<void>; onError?: () => void }) => {
          capturedMarkSeenOnSuccess = opts.onSuccess;
          capturedMarkSeenOnError = opts.onError;
          return { mutate: mockMarkAsSeen, isLoading: false };
        },
      },
    },
  },
}));

jest.mock('next/router', () => ({
  useRouter: () => ({ query: {} }),
}));

jest.mock('../../components/common/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

jest.mock('../../components/common/Loader/LoadingSpinner', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

jest.mock('../../components/features/Mail/MailTable', () => ({
  __esModule: true,
  default: () => <div data-testid="mail-table">Mail Table</div>,
}));

jest.mock('../../components/features/Mail/NewMail', () => ({
  __esModule: true,
  default: () => <div data-testid="new-mail">New Mail</div>,
}));

jest.mock('../../components/ui', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void; extraClasses?: string }) => (
    <button data-testid="button" onClick={onClick}>{children}</button>
  ),
  ToastComponent: jest.fn(),
}));

const createPlayer = (overrides = {}) => ({
  id: 1, nick: 'Test', crystal: 5000, metal: 3000, energy: 1000,
  r_energy: 0, ui_roids: 3, score: 100, size: 10, rank: 1, tag: '',
  c_airport: 0, c_crystal: 0, c_metal: 0, c_abase: 0, c_wstation: 0,
  c_amp1: 0, c_amp2: 0, c_warfactory: 0, c_destfact: 0, c_scorpfact: 0,
  c_energy: 0, c_odg: 0, r_imcrystal: 0, r_immetal: 0,
  ...overrides,
});

describe('Mail page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllMail.mockReturnValue({ data: null, isLoading: false });
  });

  it('renders null when user is not authenticated', () => {
    mockUsePlayerData.mockReturnValue({ paPlayer: null, isAuthenticated: false, user: null });
    const { container } = render(<Mail />);
    expect(container.innerHTML).toBe('');
  });

  it('renders loading spinner when mail or player data is not loaded', () => {
    mockUsePlayerData.mockReturnValue({ paPlayer: null, isAuthenticated: true, user: { username: 'Test' } });
    mockGetAllMail.mockReturnValue({ data: null, isLoading: true });
    render(<Mail />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders mail table when data is loaded', () => {
    mockUsePlayerData.mockReturnValue({ paPlayer: createPlayer(), isAuthenticated: true, user: { username: 'Test' } });
    mockGetAllMail.mockReturnValue({ data: { mail: [{ id: 1, seen: 1, news: 'Hello', header: 'Test', sentTo: 1, time: 0 }] }, isLoading: false });
    render(<Mail />);
    expect(screen.getByTestId('mail-table')).toBeInTheDocument();
  });

  it('renders "Received Mail" heading', () => {
    mockUsePlayerData.mockReturnValue({ paPlayer: createPlayer(), isAuthenticated: true, user: { username: 'Test' } });
    mockGetAllMail.mockReturnValue({ data: { mail: [] }, isLoading: false });
    render(<Mail />);
    expect(screen.getByText('Received Mail')).toBeInTheDocument();
  });

  it('renders "Mark all as seen" button when there are unseen emails', () => {
    mockUsePlayerData.mockReturnValue({ paPlayer: createPlayer(), isAuthenticated: true, user: { username: 'Test' } });
    mockGetAllMail.mockReturnValue({ data: { mail: [{ id: 1, seen: 0, news: 'Hello', header: 'Test', sentTo: 1, time: 0 }] }, isLoading: false });
    render(<Mail />);
    expect(screen.getByText('Mark all as seen')).toBeInTheDocument();
  });

  it('does not render "Mark all as seen" button when all emails are seen', () => {
    mockUsePlayerData.mockReturnValue({ paPlayer: createPlayer(), isAuthenticated: true, user: { username: 'Test' } });
    mockGetAllMail.mockReturnValue({ data: { mail: [{ id: 1, seen: 1, news: 'Hello', header: 'Test', sentTo: 1, time: 0 }] }, isLoading: false });
    render(<Mail />);
    expect(screen.queryByText('Mark all as seen')).not.toBeInTheDocument();
  });

  it('calls markAsSeen when "Mark all as seen" button is clicked', () => {
    mockUsePlayerData.mockReturnValue({ paPlayer: createPlayer(), isAuthenticated: true, user: { username: 'Test' } });
    mockGetAllMail.mockReturnValue({ data: { mail: [{ id: 1, seen: 0, news: 'Hello', header: 'Test', sentTo: 1, time: 0 }] }, isLoading: false });
    render(<Mail />);

    fireEvent.click(screen.getByText('Mark all as seen'));

    expect(mockMarkAsSeen).toHaveBeenCalledWith({ sentTo: 1 });
  });

  it('calls invalidate and refetch on markAsSeen success', async () => {
    mockUsePlayerData.mockReturnValue({ paPlayer: createPlayer(), isAuthenticated: true, user: { username: 'Test' } });
    mockGetAllMail.mockReturnValue({ data: { mail: [] }, isLoading: false });
    render(<Mail />);

    await act(async () => { await capturedMarkSeenOnSuccess?.(); });

    expect(mockInvalidate).toHaveBeenCalled();
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('shows success toast on markAsSeen success', async () => {
    const { ToastComponent } = jest.requireMock('../../components/ui');
    mockUsePlayerData.mockReturnValue({ paPlayer: createPlayer(), isAuthenticated: true, user: { username: 'Test' } });
    mockGetAllMail.mockReturnValue({ data: { mail: [] }, isLoading: false });
    render(<Mail />);

    await act(async () => { await capturedMarkSeenOnSuccess?.(); });

    expect(ToastComponent).toHaveBeenCalledWith({ message: 'Mail marked as seen', type: 'success' });
  });

  it('shows error toast on markAsSeen error', () => {
    const { ToastComponent } = jest.requireMock('../../components/ui');
    mockUsePlayerData.mockReturnValue({ paPlayer: createPlayer(), isAuthenticated: true, user: { username: 'Test' } });
    mockGetAllMail.mockReturnValue({ data: { mail: [] }, isLoading: false });
    render(<Mail />);

    capturedMarkSeenOnError?.();

    expect(ToastComponent).toHaveBeenCalledWith({ message: 'Database error', type: 'error' });
  });
});

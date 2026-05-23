import React from 'react';
import { render, screen } from '@testing-library/react';
import AlliancePage from '../../pages/alliance';
import { createMockPaPlayer } from '../../test-utils/players';

const mockUseUser = jest.fn();

jest.mock('@clerk/nextjs', () => ({
  useUser: () => mockUseUser(),
}));

const mockGetPlayerByNick = jest.fn();
const mockGetAll = jest.fn();

jest.mock('../../utils/api', () => ({
  api: {
    paUsers: {
      getPlayerByNick: {
        useQuery: () => mockGetPlayerByNick(),
      },
    },
    paTag: {
      getAll: {
        useQuery: () => mockGetAll(),
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

jest.mock('../../components/features/Alliance', () => ({
  __esModule: true,
  default: () => <div data-testid="alliance-component">Alliance</div>,
}));

describe('Alliance page', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns null when not signed in', () => {
    mockUseUser.mockReturnValue({ user: null, isSignedIn: false });
    mockGetPlayerByNick.mockReturnValue({ data: null });
    mockGetAll.mockReturnValue({ data: null, isLoading: false });

    const { container } = render(<AlliancePage />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null when signed in but no username', () => {
    mockUseUser.mockReturnValue({ user: { username: null }, isSignedIn: true });
    mockGetPlayerByNick.mockReturnValue({ data: null });
    mockGetAll.mockReturnValue({ data: null, isLoading: false });

    const { container } = render(<AlliancePage />);
    expect(container.innerHTML).toBe('');
  });

  it('renders loading spinner when player data not loaded', () => {
    mockUseUser.mockReturnValue({ user: { username: 'TestUser' }, isSignedIn: true });
    mockGetPlayerByNick.mockReturnValue({ data: null });
    mockGetAll.mockReturnValue({ data: null, isLoading: false });

    render(<AlliancePage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders loading spinner when tags are loading', () => {
    mockUseUser.mockReturnValue({ user: { username: 'TestUser' }, isSignedIn: true });
    mockGetPlayerByNick.mockReturnValue({ data: createMockPaPlayer() });
    mockGetAll.mockReturnValue({ data: null, isLoading: true });

    render(<AlliancePage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders Alliance component when player and tag data are available', () => {
    mockUseUser.mockReturnValue({ user: { username: 'TestUser' }, isSignedIn: true });
    mockGetPlayerByNick.mockReturnValue({ data: createMockPaPlayer() });
    mockGetAll.mockReturnValue({ data: [{ id: 1, name: 'TestTag' }], isLoading: false });

    render(<AlliancePage />);
    expect(screen.getByTestId('alliance-component')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import Information from '../../../../components/common/Header/Information';
import { createMockPaPlayer } from '../../../../test-utils/players';

// Mock @clerk/nextjs
const mockUseUser = jest.fn();
jest.mock('@clerk/nextjs', () => ({
  useUser: () => mockUseUser(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

// Mock the api utility
const mockGetHostilesUseQuery = jest.fn();
const mockGetFriendliesUseQuery = jest.fn();
const mockGetUnseenMailUseQuery = jest.fn();

jest.mock('@/utils/api', () => ({
  api: {
    paUsers: {
      getHostiles: {
        useQuery: (...args: unknown[]) => mockGetHostilesUseQuery(...args),
      },
      getFriendlies: {
        useQuery: (...args: unknown[]) => mockGetFriendliesUseQuery(...args),
      },
    },
    paMail: {
      getUnseenMailByUserId: {
        useQuery: (...args: unknown[]) => mockGetUnseenMailUseQuery(...args),
      },
    },
  },
}));

// Mock OverviewTable
jest.mock('../../../../components/common/Header/OverviewTable', () => {
  return function MockOverviewTable({ paPlayer }: { paPlayer: { nick: string } }) {
    return <div data-testid="overview-table">Overview for {paPlayer.nick}</div>;
  };
});

// Mock LoadingSpinner
jest.mock('../../../../components/common/Loader/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

describe('Information component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUser.mockReturnValue({ user: { username: 'TestPlayer' } });
    mockGetHostilesUseQuery.mockReturnValue({ data: null, isLoading: false });
    mockGetFriendliesUseQuery.mockReturnValue({ data: null });
    mockGetUnseenMailUseQuery.mockReturnValue({ data: null });
  });

  it('renders null when user has no username', () => {
    mockUseUser.mockReturnValue({ user: { username: null } });
    const player = createMockPaPlayer();
    const { container } = render(<Information paPlayer={player} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders null when user is undefined', () => {
    mockUseUser.mockReturnValue({ user: undefined });
    const player = createMockPaPlayer();
    const { container } = render(<Information paPlayer={player} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders null when paPlayer is undefined', () => {
    const { container } = render(<Information />);
    expect(container.innerHTML).toBe('');
  });

  it('renders OverviewTable when player data is available', () => {
    const player = createMockPaPlayer({ nick: 'TestPlayer' });
    render(<Information paPlayer={player} />);
    expect(screen.getByTestId('overview-table')).toBeInTheDocument();
    expect(screen.getByText('Overview for TestPlayer')).toBeInTheDocument();
  });

  it('shows loading spinner when hostiles data is loading', () => {
    mockGetHostilesUseQuery.mockReturnValue({ data: null, isLoading: true });
    const player = createMockPaPlayer();
    render(<Information paPlayer={player} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders hostile alert banner when hostiles are present', () => {
    mockGetHostilesUseQuery.mockReturnValue({
      data: { hostiles: '5 Infinitys from EnemyPlayer\n3 Wraiths from EnemyPlayer' },
      isLoading: false,
    });
    const player = createMockPaPlayer();
    render(<Information paPlayer={player} />);
    const alerts = screen.getAllByRole('alert');
    const hostileAlert = alerts.find((el) => el.className.includes('bg-red-300'));
    expect(hostileAlert).toBeInTheDocument();
    expect(screen.getByText('5 Infinitys from EnemyPlayer')).toBeInTheDocument();
    expect(screen.getByText('3 Wraiths from EnemyPlayer')).toBeInTheDocument();
  });

  it('renders friendly alert banner when friendlies are present', () => {
    mockGetFriendliesUseQuery.mockReturnValue({
      data: { defenders: '10 Destroyers from AllyPlayer' },
    });
    const player = createMockPaPlayer();
    render(<Information paPlayer={player} />);
    const alerts = screen.getAllByRole('alert');
    const friendlyAlert = alerts.find((el) => el.className.includes('bg-green-300'));
    expect(friendlyAlert).toBeInTheDocument();
    expect(screen.getByText('10 Destroyers from AllyPlayer')).toBeInTheDocument();
  });

  it('renders unread mail notification when there is unseen mail', () => {
    mockGetUnseenMailUseQuery.mockReturnValue({
      data: { email: [{ id: 1 }] },
    });
    const player = createMockPaPlayer();
    render(<Information paPlayer={player} />);
    expect(screen.getByText('You have unread email')).toBeInTheDocument();
  });

  it('unread mail link points to /mail', () => {
    mockGetUnseenMailUseQuery.mockReturnValue({
      data: { email: [{ id: 1 }] },
    });
    const player = createMockPaPlayer();
    render(<Information paPlayer={player} />);
    const mailLink = screen.getByText('You have unread email');
    expect(mailLink).toHaveAttribute('href', '/mail');
  });

  it('does not render unread mail notification when email array is empty', () => {
    mockGetUnseenMailUseQuery.mockReturnValue({
      data: { email: [] },
    });
    const player = createMockPaPlayer();
    render(<Information paPlayer={player} />);
    expect(screen.queryByText('You have unread email')).not.toBeInTheDocument();
  });

  it('renders newbie protection alert when player has newbie ticks', () => {
    const player = createMockPaPlayer({ newbie: 50 });
    render(<Information paPlayer={player} />);
    expect(screen.getByText('You are under protection for 50 more ticks')).toBeInTheDocument();
  });

  it('does not render newbie protection alert when newbie is 0', () => {
    const player = createMockPaPlayer({ newbie: 0 });
    render(<Information paPlayer={player} />);
    expect(screen.queryByText(/under protection/)).not.toBeInTheDocument();
  });

  it('renders multiple alerts simultaneously', () => {
    mockGetHostilesUseQuery.mockReturnValue({
      data: { hostiles: 'Incoming attack!' },
      isLoading: false,
    });
    mockGetFriendliesUseQuery.mockReturnValue({
      data: { defenders: 'Defenders arriving!' },
    });
    mockGetUnseenMailUseQuery.mockReturnValue({
      data: { email: [{ id: 1 }] },
    });
    const player = createMockPaPlayer({ newbie: 25 });
    render(<Information paPlayer={player} />);

    expect(screen.getByText('Incoming attack!')).toBeInTheDocument();
    expect(screen.getByText('Defenders arriving!')).toBeInTheDocument();
    expect(screen.getByText('You have unread email')).toBeInTheDocument();
    expect(screen.getByText('You are under protection for 25 more ticks')).toBeInTheDocument();
  });

  it('hostile alert lines are split by newlines', () => {
    mockGetHostilesUseQuery.mockReturnValue({
      data: { hostiles: 'Line 1\nLine 2\nLine 3' },
      isLoading: false,
    });
    const player = createMockPaPlayer();
    render(<Information paPlayer={player} />);
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
    expect(screen.getByText('Line 3')).toBeInTheDocument();
  });

  it('passes nick to API queries', () => {
    mockUseUser.mockReturnValue({ user: { username: 'SpecialUser' } });
    const player = createMockPaPlayer();
    render(<Information paPlayer={player} />);
    expect(mockGetHostilesUseQuery).toHaveBeenCalledWith({ nick: 'SpecialUser' });
    expect(mockGetFriendliesUseQuery).toHaveBeenCalledWith({ nick: 'SpecialUser' });
    expect(mockGetUnseenMailUseQuery).toHaveBeenCalledWith({ nick: 'SpecialUser' });
  });
});

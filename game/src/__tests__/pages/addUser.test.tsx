import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AddUser from '../../pages/addUser/[[...index]]';

interface UseUserReturn {
  user: { id?: string; username?: string | null } | null;
}

interface UseQueryReturn {
  data: { id: number; nick: string } | null | undefined;
  isLoading: boolean;
}

interface UseMutationReturn {
  mutate: jest.Mock;
}

const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseUser = jest.fn<UseUserReturn, []>();
jest.mock('@clerk/nextjs', () => ({
  useUser: () => mockUseUser(),
}));

const mockUseQuery = jest.fn<UseQueryReturn, []>();
const mockMutate = jest.fn();
const mockUseMutation = jest.fn<UseMutationReturn, [unknown]>(() => ({
  mutate: mockMutate,
}));

jest.mock('../../utils/api', () => ({
  api: {
    paUsers: {
      getPlayerByNick: {
        useQuery: (...args: unknown[]) => mockUseQuery(...(args as [])),
      },
      createPlayer: {
        useMutation: (opts: unknown) => mockUseMutation(opts),
      },
    },
  },
}));

jest.mock('../../components/common/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

jest.mock('../../components/ui', () => ({
  ToastComponent: jest.fn(),
}));

describe('AddUser page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseQuery.mockReturnValue({ data: null, isLoading: false });
    mockUseMutation.mockReturnValue({ mutate: mockMutate });
  });

  it('renders the layout with create player heading', () => {
    mockUseUser.mockReturnValue({ user: null });

    render(<AddUser />);

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByText('Create player')).toBeInTheDocument();
  });

  it('shows "Checking existing player..." when query is loading', () => {
    mockUseUser.mockReturnValue({
      user: { id: 'user_123', username: 'testuser' },
    });
    mockUseQuery.mockReturnValue({ data: null, isLoading: true });

    render(<AddUser />);

    expect(screen.getByText('Checking existing player...')).toBeInTheDocument();
  });

  it('shows "Creating player..." when query is not loading', () => {
    mockUseUser.mockReturnValue({
      user: { id: 'user_123', username: 'testuser' },
    });
    mockUseQuery.mockReturnValue({ data: null, isLoading: false });

    render(<AddUser />);

    expect(screen.getByText('Creating player...')).toBeInTheDocument();
  });

  it('does not call mutate when user is not ready', () => {
    mockUseUser.mockReturnValue({ user: null });

    render(<AddUser />);

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('does not call mutate when user has no username', () => {
    mockUseUser.mockReturnValue({
      user: { id: 'user_123', username: null },
    });

    render(<AddUser />);

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('redirects to home when existing player is found', async () => {
    mockUseUser.mockReturnValue({
      user: { id: 'user_123', username: 'testuser' },
    });
    mockUseQuery.mockReturnValue({
      data: { id: 1, nick: 'testuser' },
      isLoading: false,
    });

    render(<AddUser />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('calls mutate with correct nick when user is ready and no existing player', async () => {
    mockUseUser.mockReturnValue({
      user: { id: 'user_123', username: 'testuser' },
    });
    mockUseQuery.mockReturnValue({ data: null, isLoading: false });

    render(<AddUser />);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ nick: 'testuser' });
    });
  });

  it('does not call mutate while query is still loading', () => {
    mockUseUser.mockReturnValue({
      user: { id: 'user_123', username: 'testuser' },
    });
    mockUseQuery.mockReturnValue({ data: null, isLoading: true });

    render(<AddUser />);

    expect(mockMutate).not.toHaveBeenCalled();
  });
});

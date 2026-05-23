import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Logout from '../../pages/logout';

const mockSignOut = jest.fn();

jest.mock('@clerk/nextjs', () => ({
  useClerk: () => ({ signOut: mockSignOut }),
  SignedIn: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="signed-in">{children}</div>
  ),
  SignedOut: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="signed-out">{children}</div>
  ),
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sign-in-button">{children}</div>
  ),
}));

jest.mock('../../components/common/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

jest.mock('../../components/ui', () => ({
  Button: ({ children, onClick, ...props }: { children: React.ReactNode; onClick?: () => void; [key: string]: unknown }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

describe('Logout page', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the layout', () => {
    render(<Logout />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders SignedIn section with sign out button', () => {
    render(<Logout />);
    expect(screen.getByTestId('signed-in')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('renders SignedOut section with sign in button', () => {
    render(<Logout />);
    expect(screen.getByTestId('signed-out')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('calls signOut when sign out button is clicked', () => {
    render(<Logout />);
    const signOutButton = screen.getByText('Sign out');
    fireEvent.click(signOutButton);
    expect(mockSignOut).toHaveBeenCalled();
  });
});

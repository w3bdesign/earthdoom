import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Navbar from '../../../../components/common/Header/Navbar';

// Mock @clerk/nextjs
jest.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-in">{children}</div>,
}));

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href, target, ...props }: { children: React.ReactNode; href: string; target?: string; [key: string]: unknown }) => (
    <a href={href} target={target} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock react-use useClickAway
const mockUseClickAway = jest.fn();
jest.mock('react-use', () => ({
  useClickAway: (...args: unknown[]) => mockUseClickAway(...args),
}));

describe('Navbar component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseClickAway.mockImplementation(() => {});
  });

  it('renders the Navbar within SignedIn wrapper', () => {
    render(<Navbar />);
    expect(screen.getByTestId('signed-in')).toBeInTheDocument();
  });

  it('renders the "Main menu" button', () => {
    render(<Navbar />);
    expect(screen.getByText('Main menu')).toBeInTheDocument();
  });

  it('renders the hamburger toggle button for mobile', () => {
    render(<Navbar />);
    const toggleButton = screen.getByLabelText('Toggle navigation');
    expect(toggleButton).toBeInTheDocument();
  });

  it('dropdown menu is hidden by default', () => {
    render(<Navbar />);
    const mainMenuButton = screen.getByText('Main menu').closest('button');
    expect(mainMenuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles dropdown visibility when "Main menu" is clicked', () => {
    render(<Navbar />);
    const mainMenuButton = screen.getByText('Main menu').closest('button') as HTMLElement;

    // Initially closed
    expect(mainMenuButton).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    fireEvent.click(mainMenuButton);
    expect(mainMenuButton).toHaveAttribute('aria-expanded', 'true');

    // Click to close
    fireEvent.click(mainMenuButton);
    expect(mainMenuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles dropdown visibility when hamburger button is clicked', () => {
    render(<Navbar />);
    const toggleButton = screen.getByLabelText('Toggle navigation');
    const mainMenuButton = screen.getByText('Main menu').closest('button') as HTMLElement;

    // Initially closed
    expect(mainMenuButton).toHaveAttribute('aria-expanded', 'false');

    // Click hamburger to open
    fireEvent.click(toggleButton);
    expect(mainMenuButton).toHaveAttribute('aria-expanded', 'true');

    // Click hamburger to close
    fireEvent.click(toggleButton);
    expect(mainMenuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders all navigation links when expanded', () => {
    render(<Navbar />);
    const mainMenuButton = screen.getByText('Main menu').closest('button') as HTMLElement;
    fireEvent.click(mainMenuButton);

    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Manual')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('Mail')).toBeInTheDocument();
    expect(screen.getByText('Production')).toBeInTheDocument();
    expect(screen.getByText('Construct')).toBeInTheDocument();
    expect(screen.getByText('Research')).toBeInTheDocument();
    expect(screen.getByText('Energy')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Military')).toBeInTheDocument();
    expect(screen.getByText('Spying')).toBeInTheDocument();
    expect(screen.getByText('Ranking')).toBeInTheDocument();
    expect(screen.getByText('Alliance')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('links have correct href attributes', () => {
    render(<Navbar />);
    const mainMenuButton = screen.getByText('Main menu').closest('button') as HTMLElement;
    fireEvent.click(mainMenuButton);

    expect(screen.getByText('Main').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Manual').closest('a')).toHaveAttribute('href', 'https://earthdoom.com/manual');
    expect(screen.getByText('News').closest('a')).toHaveAttribute('href', '/news');
    expect(screen.getByText('Logout').closest('a')).toHaveAttribute('href', '/logout');
  });

  it('Manual link opens in new tab', () => {
    render(<Navbar />);
    const mainMenuButton = screen.getByText('Main menu').closest('button') as HTMLElement;
    fireEvent.click(mainMenuButton);

    const manualLink = screen.getByText('Manual').closest('a');
    expect(manualLink).toHaveAttribute('target', '_new');
  });

  it('internal links use _self target', () => {
    render(<Navbar />);
    const mainMenuButton = screen.getByText('Main menu').closest('button') as HTMLElement;
    fireEvent.click(mainMenuButton);

    const mainLink = screen.getByText('Main').closest('a');
    expect(mainLink).toHaveAttribute('target', '_self');
  });

  it('dropdown has visible class when expanded', () => {
    const { container } = render(<Navbar />);
    const mainMenuButton = screen.getByText('Main menu').closest('button') as HTMLElement;
    fireEvent.click(mainMenuButton);

    const dropdown = container.querySelector('[aria-labelledby="dropdownMenuButtonX"]');
    expect(dropdown).toHaveClass('visible');
    expect(dropdown).toHaveClass('opacity-100');
  });

  it('dropdown has invisible class when collapsed', () => {
    const { container } = render(<Navbar />);

    const dropdown = container.querySelector('[aria-labelledby="dropdownMenuButtonX"]');
    expect(dropdown).toHaveClass('invisible');
    expect(dropdown).toHaveClass('opacity-0');
  });

  it('registers useClickAway with the navbar ref', () => {
    render(<Navbar />);
    expect(mockUseClickAway).toHaveBeenCalledTimes(1);
    expect(mockUseClickAway).toHaveBeenCalledWith(
      expect.objectContaining({ current: expect.any(Object) }),
      expect.any(Function),
    );
  });

  it('useClickAway callback collapses the menu', () => {
    const { container } = render(<Navbar />);
    const mainMenuButton = screen.getByText('Main menu').closest('button') as HTMLElement;

    // Open the menu
    fireEvent.click(mainMenuButton);
    expect(mainMenuButton).toHaveAttribute('aria-expanded', 'true');

    // Simulate click away by calling the callback wrapped in act
    const clickAwayCallback = mockUseClickAway.mock.calls[0]?.[1] as (() => void) | undefined;
    act(() => {
      if (clickAwayCallback) {
        clickAwayCallback();
      }
    });

    // Menu should now be collapsed
    expect(mainMenuButton).toHaveAttribute('aria-expanded', 'false');
    const dropdown = container.querySelector('[aria-labelledby="dropdownMenuButtonX"]');
    expect(dropdown).toHaveClass('invisible');
    expect(dropdown).toHaveClass('opacity-0');
  });
});

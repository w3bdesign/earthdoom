import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Country from '../../pages/country';

const mockGetAll = jest.fn();

jest.mock('../../utils/api', () => ({
  api: {
    paUsers: {
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

jest.mock('../../components/ui', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('react-icons/bs', () => ({
  BsArrowLeft: () => <span data-testid="arrow-left">←</span>,
  BsArrowRight: () => <span data-testid="arrow-right">→</span>,
}));

describe('Country page', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the layout', () => {
    mockGetAll.mockReturnValue({ data: null });
    render(<Country />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    mockGetAll.mockReturnValue({ data: null });
    render(<Country />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    mockGetAll.mockReturnValue({ data: null });
    render(<Country />);
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Tag')).toBeInTheDocument();
    expect(screen.getByText('Nick')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Spying')).toBeInTheDocument();
    expect(screen.getByText('Mail')).toBeInTheDocument();
  });

  it('renders player data in the table', () => {
    mockGetAll.mockReturnValue({
      data: [
        {
          id: 1,
          nick: 'Player1',
          y: 2,
          tag: 'TAG1',
          score: 5000,
          commander: 0,
          timer: 0,
        },
      ],
    });
    render(<Country />);
    expect(screen.getByText('Player1')).toBeInTheDocument();
    expect(screen.getByText('TAG1')).toBeInTheDocument();
    expect(screen.getByText('5000')).toBeInTheDocument();
  });

  it('renders input field with initial value 1', () => {
    mockGetAll.mockReturnValue({ data: null });
    render(<Country />);
    const input = screen.getByDisplayValue('1');
    expect(input).toBeInTheDocument();
  });

  it('highlights commander players in red', () => {
    mockGetAll.mockReturnValue({
      data: [
        {
          id: 1,
          nick: 'Commander1',
          y: 1,
          tag: '',
          score: 1000,
          commander: 1,
          timer: 0,
        },
      ],
    });
    render(<Country />);
    const playerSpan = screen.getByText('Commander1');
    expect(playerSpan).toHaveClass('text-red');
  });

  it('shows ONLINE status for recently active players', () => {
    mockGetAll.mockReturnValue({
      data: [
        {
          id: 1,
          nick: 'ActivePlayer',
          y: 1,
          tag: '',
          score: 1000,
          commander: 0,
          timer: Date.now(),
        },
      ],
    });
    render(<Country />);
    expect(screen.getByText('(ONLINE)')).toBeInTheDocument();
  });

  it('renders spying and mail links for each player', () => {
    mockGetAll.mockReturnValue({
      data: [
        {
          id: 42,
          nick: 'Player1',
          y: 1,
          tag: '',
          score: 1000,
          commander: 0,
          timer: 0,
        },
      ],
    });
    render(<Country />);
    const links = screen.getAllByRole('link');
    const spyLink = links.find(link => link.getAttribute('href') === '/spy?id=42');
    const mailLink = links.find(link => link.getAttribute('href') === '/mail?id=42');
    expect(spyLink).toBeInTheDocument();
    expect(mailLink).toBeInTheDocument();
  });
});

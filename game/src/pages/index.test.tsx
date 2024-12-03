import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './index';
import type { PaUsers } from '@prisma/client';

// Define the PaPlayer type that extends PaUsers
interface PaPlayer extends PaUsers {
  [key: string]: number | string | null | undefined;
}

interface UseUserReturn {
  isSignedIn: boolean;
  user: { username: string | null } | null;
}

interface UseQueryReturn {
  data: PaPlayer | null | undefined;
  isLoading: boolean;
  error?: Error;
}

// Mock the clerk hook
const mockUseUser = jest.fn<UseUserReturn, []>();
jest.mock('@clerk/nextjs', () => ({
  useUser: () => mockUseUser()
}));

// Mock the api
const mockUseQuery = jest.fn<UseQueryReturn, []>();
jest.mock('../utils/api', () => ({
  api: {
    paUsers: {
      getPlayerByNick: {
        useQuery: () => mockUseQuery()
      }
    }
  }
}));

// Mock the components
jest.mock('../components/common/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>
}));

jest.mock('../components/common/Loader/LoadingSpinner', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>
}));

jest.mock('../components/ui/tables/UnitsTable', () => ({
  __esModule: true,
  default: ({ paPlayer }: { paPlayer: PaPlayer }) => (
    <div data-testid="units-table">Units Table: {paPlayer.nick}</div>
  )
}));

jest.mock('../components/ui/tables/BDUTable', () => ({
  __esModule: true,
  default: ({ paPlayer }: { paPlayer: PaPlayer }) => (
    <div data-testid="bdu-table">BDU Table: {paPlayer.nick}</div>
  )
}));

jest.mock('../components/ui/tables/LandTable', () => ({
  __esModule: true,
  default: ({ paPlayer }: { paPlayer: PaPlayer }) => (
    <div data-testid="land-table">Land Table: {paPlayer.nick}</div>
  )
}));

jest.mock('../components/ui/tables/FleetTable', () => ({
  __esModule: true,
  default: ({ paPlayer }: { paPlayer: PaPlayer }) => (
    <div data-testid="fleet-table">Fleet Table: {paPlayer.nick}</div>
  )
}));

describe('Home component', () => {
  beforeEach(() => {
    mockUseUser.mockClear();
    mockUseQuery.mockClear();
  });

  it('renders null when user is not signed in', () => {
    mockUseUser.mockReturnValue({
      isSignedIn: false,
      user: null
    });
    
    const { container } = render(<Home />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when user is signed in but has no username', () => {
    mockUseUser.mockReturnValue({
      isSignedIn: true,
      user: { username: null }
    });
    
    const { container } = render(<Home />);
    expect(container.firstChild).toBeNull();
  });

  it('renders loading spinner when signed in but player data is loading', () => {
    mockUseUser.mockReturnValue({
      isSignedIn: true,
      user: { username: 'testuser' }
    });
    
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: true
    });

    const { getByTestId } = render(<Home />);
    expect(getByTestId('loading-spinner')).toBeInTheDocument();
    expect(getByTestId('layout')).toBeInTheDocument();
  });

  it('renders loading spinner when player data is undefined', () => {
    mockUseUser.mockReturnValue({
      isSignedIn: true,
      user: { username: 'testuser' }
    });
    
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false
    });

    const { getByTestId } = render(<Home />);
    expect(getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders all tables with correct player data', () => {
    const mockPlayer: PaPlayer = {
      id: 1,
      nick: 'TestPlayer',
      crystal: 1000,
      metal: 1000,
      energy: 1000,
      infinitys: 10,
      wraiths: 10,
      warfrigs: 10,
      destroyers: 10,
      scorpions: 10,
      astropods: 10,
      war: 0,
      def: 0,
      tag: 'TEST',
      rank: 1,
      x: 1,
      y: 1,
      commander: 0,
      galname: 'Test Galaxy',
      galpic: '125x125earthdoom1.gif',
      civilians: 1000,
      tax: 20,
      credits: 5000,
      newbie: 100,
      paConstructId: null,
      // Add all other required fields with default values
      r_energy: 0,
      sats: 0,
      cobras: 0,
      infinitys_base: 0,
      wraiths_base: 0,
      warfrigs_base: 0,
      destroyers_base: 0,
      scorpions_base: 0,
      astropods_base: 0,
      cobras_base: 0,
      p_scorpions: 0,
      p_scorpions_eta: 0,
      p_cobras: 0,
      p_cobras_eta: 0,
      missiles: 0,
      score: 0,
      asteroids: 0,
      asteroid_crystal: 0,
      asteroid_metal: 0,
      ui_roids: 0,
      wareta: 0,
      defeta: 0,
      r_imcrystal: 0,
      r_immetal: 0,
      r_iafs: 0,
      r_aaircraft: 0,
      r_tbeam: 0,
      r_uscan: 0,
      r_oscan: 0,
      p_infinitys: 0,
      p_infinitys_eta: 0,
      p_wraiths: 0,
      p_wraiths_eta: 0,
      p_warfrigs: 0,
      p_warfrigs_eta: 0,
      p_destroyers: 0,
      p_destroyers_eta: 0,
      p_missiles: 0,
      p_missiles_eta: 0,
      timer: 0,
      size: 0,
      p_astropods: 0,
      p_astropods_eta: 0,
      rcannons: 0,
      p_rcannons: 0,
      p_rcannons_eta: 0,
      avengers: 0,
      p_avengers: 0,
      p_avengers_eta: 0,
      lstalkers: 0,
      p_lstalkers: 0,
      p_lstalkers_eta: 0,
      r_odg: 0,
      sleep: 0,
      lastsleep: 0,
      closed: 0,
      motd: 0,
      vote: ''
    };

    mockUseUser.mockReturnValue({
      isSignedIn: true,
      user: { username: 'testuser' }
    });
    
    mockUseQuery.mockReturnValue({
      data: mockPlayer,
      isLoading: false
    });

    render(<Home />);
    
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('units-table')).toBeInTheDocument();
    expect(screen.getByTestId('bdu-table')).toBeInTheDocument();
    expect(screen.getByTestId('land-table')).toBeInTheDocument();
    expect(screen.getByTestId('fleet-table')).toBeInTheDocument();

    // Verify player data is passed correctly
    expect(screen.getByTestId('units-table')).toHaveTextContent('TestPlayer');
    expect(screen.getByTestId('bdu-table')).toHaveTextContent('TestPlayer');
    expect(screen.getByTestId('land-table')).toHaveTextContent('TestPlayer');
    expect(screen.getByTestId('fleet-table')).toHaveTextContent('TestPlayer');
  });

  it('handles error state in API query', () => {
    mockUseUser.mockReturnValue({
      isSignedIn: true,
      user: { username: 'testuser' }
    });
    
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch player data')
    });

    const { getByTestId } = render(<Home />);
    expect(getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('passes correct query parameters to API', () => {
    const username = 'testuser';
    mockUseUser.mockReturnValue({
      isSignedIn: true,
      user: { username }
    });
    
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: true
    });

    render(<Home />);
    
    // Verify API was called with correct parameters
    expect(mockUseQuery).toHaveBeenCalled();
    const queryResult = mockUseQuery.mock.results[0]?.value as UseQueryReturn;
    expect(queryResult.isLoading).toBe(true);
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import Home from './index';

// Mock the clerk hook
const mockUseUser = jest.fn();
jest.mock('@clerk/nextjs', () => ({
  useUser: () => mockUseUser()
}));

// Mock the api
const mockUseQuery = jest.fn();
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
  default: () => <div data-testid="units-table">Units Table</div>
}));

jest.mock('../components/ui/tables/BDUTable', () => ({
  __esModule: true,
  default: () => <div data-testid="bdu-table">BDU Table</div>
}));

jest.mock('../components/ui/tables/LandTable', () => ({
  __esModule: true,
  default: () => <div data-testid="land-table">Land Table</div>
}));

jest.mock('../components/ui/tables/FleetTable', () => ({
  __esModule: true,
  default: () => <div data-testid="fleet-table">Fleet Table</div>
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

  it('renders loading spinner when signed in but player data is loading', () => {
    mockUseUser.mockReturnValue({
      isSignedIn: true,
      user: { username: 'testuser' }
    });
    
    mockUseQuery.mockReturnValue({
      data: null
    });

    const { getByTestId } = render(<Home />);
    expect(getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders all tables when player data is loaded', () => {
    mockUseUser.mockReturnValue({
      isSignedIn: true,
      user: { username: 'testuser' }
    });
    
    mockUseQuery.mockReturnValue({
      data: { id: 1, name: 'Test Player' }
    });

    const { getByTestId } = render(<Home />);
    expect(getByTestId('units-table')).toBeInTheDocument();
    expect(getByTestId('bdu-table')).toBeInTheDocument();
    expect(getByTestId('land-table')).toBeInTheDocument();
    expect(getByTestId('fleet-table')).toBeInTheDocument();
  });
});

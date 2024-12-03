import React from 'react';
import { render } from '@testing-library/react';
import Home from './index';

// Mock the clerk hook
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    isSignedIn: false,
    user: null
  })
}));

// Mock the api
jest.mock('../utils/api', () => ({
  api: {
    paUsers: {
      getPlayerByNick: {
        useQuery: () => ({
          data: null
        })
      }
    }
  }
}));

// Mock the components
jest.mock('../components/common/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('../components/common/Loader/LoadingSpinner', () => ({
  __esModule: true,
  default: () => <div>Loading...</div>
}));

describe('Home component', () => {
  it('renders null when user is not signed in', () => {
    const { container } = render(<Home />);
    expect(container.firstChild).toBeNull();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import Home from './index';

describe('Home component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<Home />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { RenderIncoming } from '../../components/ui/notifications/RenderIncoming';

jest.mock('../../components/common/Loader/LoadingSpinner', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe('RenderIncoming', () => {
  it('renders loading spinner when isLoading is true', () => {
    render(<RenderIncoming isLoading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders "No data" when not loading and no news', () => {
    render(<RenderIncoming isLoading={false} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders hostile news when hostiles provided', () => {
    render(
      <RenderIncoming isLoading={false} hostiles="Enemy approaching!" />
    );
    expect(screen.getByText('Enemy approaching!')).toBeInTheDocument();
  });

  it('renders friendly news when friendlies provided', () => {
    render(
      <RenderIncoming isLoading={false} friendlies="Ally defending!" />
    );
    expect(screen.getByText('Ally defending!')).toBeInTheDocument();
  });

  it('renders both hostile and friendly news when both provided', () => {
    render(
      <RenderIncoming
        isLoading={false}
        hostiles="Enemy attacking"
        friendlies="Ally incoming"
      />
    );
    expect(screen.getByText('Enemy attacking')).toBeInTheDocument();
    expect(screen.getByText('Ally incoming')).toBeInTheDocument();
  });

  it('does not render "No data" when hostiles are present', () => {
    render(
      <RenderIncoming isLoading={false} hostiles="Hostiles detected" />
    );
    expect(screen.queryByText('No data')).not.toBeInTheDocument();
  });

  it('does not render "No data" when friendlies are present', () => {
    render(
      <RenderIncoming isLoading={false} friendlies="Friends arriving" />
    );
    expect(screen.queryByText('No data')).not.toBeInTheDocument();
  });

  it('applies red color styling to hostile news', () => {
    render(
      <RenderIncoming isLoading={false} hostiles="Red alert!" />
    );
    const hostileElement = screen.getByText('Red alert!');
    expect(hostileElement).toHaveClass('text-red-500');
  });

  it('applies green color styling to friendly news', () => {
    render(
      <RenderIncoming isLoading={false} friendlies="Green signal!" />
    );
    const friendlyElement = screen.getByText('Green signal!');
    expect(friendlyElement).toHaveClass('text-green-500');
  });

  it('does not render spinner when isLoading is false', () => {
    render(<RenderIncoming isLoading={false} />);
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });
});

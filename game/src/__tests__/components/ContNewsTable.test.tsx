import React from 'react';
import { render, screen } from '@testing-library/react';
import ContNewsTable from '../../components/features/ContNews/ContNewsTable';

jest.mock('../../components/ui', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

describe('ContNewsTable', () => {
  const mockNews = [
    { id: 1, header: 'News Title 1', news: 'Content 1', time: 1000000, sentTo: 1, seen: '0' },
    { id: 2, header: 'News Title 2', news: 'Content 2', time: 1000001, sentTo: 1, seen: '0' },
  ];

  it('renders table headers', () => {
    render(<ContNewsTable news={mockNews} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders news items', () => {
    render(<ContNewsTable news={mockNews} />);
    expect(screen.getByText('News Title 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('News Title 2')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('renders delete buttons for each news item', () => {
    render(<ContNewsTable news={mockNews} />);
    const deleteButtons = screen.getAllByText('Delete');
    // Header "Delete" th + 2 buttons = we just check buttons
    expect(deleteButtons.length).toBeGreaterThanOrEqual(2);
  });

  it('renders empty table when no news', () => {
    render(<ContNewsTable news={[]} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    // No news rows
    expect(screen.queryByText('News Title 1')).not.toBeInTheDocument();
  });

  it('renders a table element', () => {
    const { container } = render(<ContNewsTable news={mockNews} />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('renders news IDs', () => {
    render(<ContNewsTable news={mockNews} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageTable from '../../components/ui/tables/MessageTable';

describe('MessageTable', () => {
  const mockItems = [
    { id: 1, time: 1700000000, header: 'Test Title 1', news: 'Test content 1' },
    { id: 2, time: 1700001000, header: 'Test Title 2', news: 'Test content 2' },
    { id: 3, time: 1700002000, header: 'Test Title 3', news: 'Test content 3' },
  ];

  const defaultProps = {
    items: mockItems,
    isDeleting: false,
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders null when items array is empty', () => {
    const { container } = render(
      <MessageTable {...defaultProps} items={[]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders null when all items are filtered out', () => {
    const { container } = render(
      <MessageTable {...defaultProps} filterRow={() => false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders a table with correct headers', () => {
    render(<MessageTable {...defaultProps} />);
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders custom timeColumnLabel', () => {
    render(<MessageTable {...defaultProps} timeColumnLabel="Date" />);
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.queryByText('Time')).not.toBeInTheDocument();
  });

  it('renders all items as rows', () => {
    render(<MessageTable {...defaultProps} />);
    expect(screen.getByText('Test Title 1')).toBeInTheDocument();
    expect(screen.getByText('Test Title 2')).toBeInTheDocument();
    expect(screen.getByText('Test Title 3')).toBeInTheDocument();
    expect(screen.getByText('Test content 1')).toBeInTheDocument();
    expect(screen.getByText('Test content 2')).toBeInTheDocument();
    expect(screen.getByText('Test content 3')).toBeInTheDocument();
  });

  it('formats time correctly using date-fns format', () => {
    // time: 1700000000 => new Date(1700000000 * 1000) => 14/11-2023 22:13:20 UTC
    const items = [{ id: 1, time: 1700000000, header: 'Title', news: 'News' }];
    render(<MessageTable {...defaultProps} items={items} />);
    // The date will be formatted with the user's local timezone, 
    // so we check that it contains a date-like pattern
    const cells = screen.getAllByRole('cell');
    // First cell should contain the formatted date
    expect(cells[0]?.textContent).toMatch(/\d{2}\/\d{2}-\d{4} \d{2}:\d{2}:\d{2}/);
  });

  it('renders Delete buttons for each row', () => {
    render(<MessageTable {...defaultProps} />);
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons).toHaveLength(3);
  });

  it('calls onDelete with correct id when Delete button is clicked', () => {
    const onDelete = jest.fn();
    render(<MessageTable {...defaultProps} onDelete={onDelete} />);
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[1]!);
    expect(onDelete).toHaveBeenCalledWith(2);
  });

  it('disables Delete buttons when isDeleting is true', () => {
    render(<MessageTable {...defaultProps} isDeleting={true} />);
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    deleteButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('enables Delete buttons when isDeleting is false', () => {
    render(<MessageTable {...defaultProps} isDeleting={false} />);
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    deleteButtons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  it('filters items using filterRow predicate', () => {
    const filterRow = (item: { id: number }) => item.id !== 2;
    render(<MessageTable {...defaultProps} filterRow={filterRow} />);
    expect(screen.getByText('Test Title 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Title 2')).not.toBeInTheDocument();
    expect(screen.getByText('Test Title 3')).toBeInTheDocument();
  });

  it('renders proper table structure', () => {
    const { container } = render(<MessageTable {...defaultProps} />);
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(container.querySelector('thead')).toBeInTheDocument();
    expect(container.querySelector('tbody')).toBeInTheDocument();
  });

  it('renders correct number of rows in tbody', () => {
    const { container } = render(<MessageTable {...defaultProps} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(3);
  });

  it('uses default timeColumnLabel of "Time" when not specified', () => {
    render(<MessageTable {...defaultProps} />);
    expect(screen.getByText('Time')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import AdvancedDataTable from '../../components/ui/tables/AdvancedDataTable/AdvancedDataTable';
import { createMockPaPlayer } from '../../test-utils/players';
import type { AdvancedTableColumn } from '../../components/ui/tables/AdvancedDataTable/AdvancedDataTable';
import type { Building } from '../../components/features/Construct/types/types';

jest.mock('../../components/ui/notifications/ToastComponent', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('AdvancedDataTable', () => {
  const defaultPlayer = createMockPaPlayer({ crystal: 5000, metal: 3000 });

  const defaultColumns: AdvancedTableColumn[] = [
    { label: 'Name', accessor: 'nick' },
    { label: 'Crystal', accessor: 'crystal' },
    { label: 'Metal', accessor: 'metal' },
  ];

  const defaultProps = {
    columns: defaultColumns,
    data: [defaultPlayer],
    caption: 'Test Table',
  };

  it('renders the table caption', () => {
    render(<AdvancedDataTable {...defaultProps} />);
    expect(screen.getByText('Test Table')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<AdvancedDataTable {...defaultProps} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Crystal')).toBeInTheDocument();
    expect(screen.getByText('Metal')).toBeInTheDocument();
  });

  it('renders data from the data prop using string accessors', () => {
    render(<AdvancedDataTable {...defaultProps} />);
    expect(screen.getByText('TestPlayer')).toBeInTheDocument();
    expect(screen.getByText('5000')).toBeInTheDocument();
    expect(screen.getByText('3000')).toBeInTheDocument();
  });

  it('renders proper table structure', () => {
    const { container } = render(<AdvancedDataTable {...defaultProps} />);
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(container.querySelector('thead')).toBeInTheDocument();
    expect(container.querySelector('tbody')).toBeInTheDocument();
    expect(container.querySelector('caption')).toBeInTheDocument();
  });

  it('renders multiple rows with multiple data entries', () => {
    const player1 = createMockPaPlayer({ nick: 'Player1', crystal: 100 });
    const player2 = createMockPaPlayer({ nick: 'Player2', crystal: 200 });
    render(
      <AdvancedDataTable {...defaultProps} data={[player1, player2]} />
    );
    expect(screen.getByText('Player1')).toBeInTheDocument();
    expect(screen.getByText('Player2')).toBeInTheDocument();
  });

  it('uses renderData instead of data when provided', () => {
    const renderData: Building[] = [
      {
        buildingId: 1,
        buildingName: 'Crystal Mine',
        buildingDescription: 'Mines crystal',
        buildingFieldName: 'c_crystal',
        buildingETA: 3,
        buildingCost: '100 credits',
        buildingCostCrystal: 100,
        buildingCostTitanium: 50,
      },
    ];
    const columns: AdvancedTableColumn[] = [
      { label: 'Building', accessor: 'buildingName' },
      { label: 'Cost', accessor: 'buildingCost' },
    ];
    render(
      <AdvancedDataTable
        columns={columns}
        data={[defaultPlayer]}
        caption="Buildings"
        renderData={renderData}
      />
    );
    expect(screen.getByText('Crystal Mine')).toBeInTheDocument();
    expect(screen.getByText('100 credits')).toBeInTheDocument();
  });

  it('renders data-th attributes on td elements', () => {
    const { container } = render(<AdvancedDataTable {...defaultProps} />);
    const tds = container.querySelectorAll('td');
    expect(tds[0]).toHaveAttribute('data-th', 'Name');
    expect(tds[1]).toHaveAttribute('data-th', 'Crystal');
    expect(tds[2]).toHaveAttribute('data-th', 'Metal');
  });

  it('renders with function accessor', () => {
    const columns: AdvancedTableColumn[] = [
      {
        label: 'Custom',
        accessor: (row) => <span data-testid="custom-cell">{String(row.nick)}</span>,
      },
    ];
    render(
      <AdvancedDataTable columns={columns} data={[defaultPlayer]} caption="Custom" />
    );
    expect(screen.getByTestId('custom-cell')).toBeInTheDocument();
    expect(screen.getByTestId('custom-cell')).toHaveTextContent('TestPlayer');
  });

  it('renders with JSX Element accessor', () => {
    const columns: AdvancedTableColumn[] = [
      {
        label: 'Static',
        accessor: <span data-testid="static-element">Static Content</span>,
      },
    ];
    render(
      <AdvancedDataTable columns={columns} data={[defaultPlayer]} caption="Static" />
    );
    expect(screen.getByTestId('static-element')).toBeInTheDocument();
  });

  it('does not render action button when action is not provided', () => {
    const columns: AdvancedTableColumn[] = [
      { label: 'Action', accessor: '', type: 'button' },
    ];
    render(
      <AdvancedDataTable columns={columns} data={[defaultPlayer]} caption="No Action" />
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders action button when action and actionText are provided', () => {
    const mockMutate = jest.fn();
    const renderData: Building[] = [
      {
        buildingId: 1,
        buildingName: 'Test Building',
        buildingDescription: 'A test',
        buildingFieldName: 'c_crystal',
        buildingETA: 3,
        buildingCost: '100 credits',
        buildingCostCrystal: 100,
        buildingCostTitanium: 50,
        needsFieldName: 0,
        hasInputField: 'undefined',
      },
    ];
    const columns: AdvancedTableColumn[] = [
      { label: 'Name', accessor: 'buildingName' },
      { label: 'Action', accessor: '', type: 'button' },
    ];
    render(
      <AdvancedDataTable
        columns={columns}
        data={[defaultPlayer]}
        caption="With Action"
        renderData={renderData}
        action={mockMutate}
        actionText="Build"
      />
    );
    expect(screen.getByRole('button', { name: 'Build' })).toBeInTheDocument();
  });

  it('renders empty tbody when data is empty', () => {
    const { container } = render(
      <AdvancedDataTable columns={defaultColumns} data={[]} caption="Empty" />
    );
    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
    expect(tbody?.children.length).toBe(0);
  });

  it('renders correct number of columns in header', () => {
    const { container } = render(<AdvancedDataTable {...defaultProps} />);
    const thElements = container.querySelectorAll('th');
    expect(thElements).toHaveLength(3);
  });

  it('renders correct number of cells per row', () => {
    const { container } = render(<AdvancedDataTable {...defaultProps} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(1);
    const cells = rows[0]?.querySelectorAll('td');
    expect(cells).toHaveLength(3);
  });

  it('defaults isLoading to false', () => {
    const mockMutate = jest.fn();
    const renderData: Building[] = [
      {
        buildingId: 1,
        buildingName: 'Test',
        buildingDescription: 'Test',
        buildingFieldName: 'c_crystal',
        buildingETA: 3,
        buildingCost: '100',
        buildingCostCrystal: 100,
        buildingCostTitanium: 50,
        needsFieldName: 0,
        hasInputField: 'undefined',
      },
    ];
    const columns: AdvancedTableColumn[] = [
      { label: 'Action', accessor: '', type: 'button' },
    ];
    render(
      <AdvancedDataTable
        columns={columns}
        data={[defaultPlayer]}
        caption="Loading Test"
        renderData={renderData}
        action={mockMutate}
        actionText="Build"
      />
    );
    // Button should be enabled since isLoading defaults to false and player can afford
    expect(screen.getByRole('button', { name: 'Build' })).not.toBeDisabled();
  });

  it('disables action button when isLoading is true', () => {
    const mockMutate = jest.fn();
    const renderData: Building[] = [
      {
        buildingId: 1,
        buildingName: 'Test',
        buildingDescription: 'Test',
        buildingFieldName: 'c_crystal',
        buildingETA: 3,
        buildingCost: '100',
        buildingCostCrystal: 100,
        buildingCostTitanium: 50,
        needsFieldName: 0,
        hasInputField: 'undefined',
      },
    ];
    const columns: AdvancedTableColumn[] = [
      { label: 'Action', accessor: '', type: 'button' },
    ];
    render(
      <AdvancedDataTable
        columns={columns}
        data={[defaultPlayer]}
        caption="Loading Test"
        renderData={renderData}
        action={mockMutate}
        actionText="Build"
        isLoading={true}
      />
    );
    expect(screen.getByRole('button', { name: 'Build' })).toBeDisabled();
  });
});

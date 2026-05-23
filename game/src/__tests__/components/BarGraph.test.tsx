import React from 'react';
import { render } from '@testing-library/react';
import BarChart from '../../components/features/Resources/BarGraph';
import type { ChartData } from '../../components/features/Resources/BarGraph';

// Mock chart.js and react-chartjs-2 since they use canvas
jest.mock('react-chartjs-2', () => ({
  Bar: ({ data, options }: { data: unknown; options: unknown }) => (
    <div data-testid="bar-chart" data-data={JSON.stringify(data)} data-options={JSON.stringify(options)}>
      Mock Bar Chart
    </div>
  ),
}));

jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  registerables: [],
}));

describe('BarChart', () => {
  const mockChartData: ChartData = {
    labels: ['Titanium', 'Credits', 'Energy'],
    datasets: [
      {
        label: 'Income',
        data: [600, 200, 225],
        backgroundColor: ['rgba(59, 113, 202, 1)'],
        borderColor: ['rgba(255,255,255,1)'],
        borderWidth: 2,
      },
    ],
  };

  it('renders the bar chart component', () => {
    const { getByTestId } = render(<BarChart chartData={mockChartData} />);
    expect(getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('passes data to the Bar component', () => {
    const { getByTestId } = render(<BarChart chartData={mockChartData} />);
    const chart = getByTestId('bar-chart');
    const passedData = JSON.parse(chart.getAttribute('data-data') || '{}');
    expect(passedData.labels).toEqual(['Titanium', 'Credits', 'Energy']);
    expect(passedData.datasets[0].data).toEqual([600, 200, 225]);
  });

  it('passes options with title "Income"', () => {
    const { getByTestId } = render(<BarChart chartData={mockChartData} />);
    const chart = getByTestId('bar-chart');
    const passedOptions = JSON.parse(chart.getAttribute('data-options') || '{}');
    expect(passedOptions.plugins.title.text).toBe('Income');
    expect(passedOptions.plugins.title.display).toBe(true);
  });

  it('sets responsive to true in options', () => {
    const { getByTestId } = render(<BarChart chartData={mockChartData} />);
    const chart = getByTestId('bar-chart');
    const passedOptions = JSON.parse(chart.getAttribute('data-options') || '{}');
    expect(passedOptions.responsive).toBe(true);
  });

  it('renders with different chart data', () => {
    const customData: ChartData = {
      labels: ['A', 'B'],
      datasets: [
        {
          label: 'Test',
          data: [100, 200],
          backgroundColor: ['blue'],
          borderColor: ['white'],
          borderWidth: 1,
        },
      ],
    };
    const { getByTestId } = render(<BarChart chartData={customData} />);
    const chart = getByTestId('bar-chart');
    const passedData = JSON.parse(chart.getAttribute('data-data') || '{}');
    expect(passedData.labels).toEqual(['A', 'B']);
  });
});

import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

interface Props {
  chartData: ChartData;
}

Chart.register(...registerables);

// Bar colours per label, matching the resource colours used across the game
const LABEL_COLORS: Record<string, string> = {
  Titanium: "#b9c6d6",
  Credits: "#f2c45a",
  Energy: "#a99cf6",
};

const AXIS = { color: "#9aa9bc", font: { family: "inherit" } };

const BarChart: React.FC<Props> = ({ chartData }) => {
  const { labels } = chartData;

  const data = {
    labels,
    datasets: chartData.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: labels.map((label) => LABEL_COLORS[label] ?? "#4cc3f2"),
      borderWidth: 0,
      borderRadius: 4,
      maxBarThickness: 56,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false, text: "Income" },
      tooltip: {
        backgroundColor: "#172231",
        borderColor: "#31435b",
        borderWidth: 1,
        titleColor: "#e7edf5",
        bodyColor: "#e7edf5",
      },
    },
    scales: {
      x: {
        ticks: AXIS,
        grid: { display: false },
        border: { color: "#31435b" },
      },
      y: {
        ticks: AXIS,
        grid: { color: "#223044" },
        border: { display: false },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="relative h-56">
      <Bar
        data={data}
        options={options}
        aria-label="Income per tick by resource"
        role="img"
      />
    </div>
  );
};

export default BarChart;

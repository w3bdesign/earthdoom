import React from "react";
import { Bar } from "react-chartjs-2";

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

const BarChart: React.FC<Props> = ({ chartData }) => {
  const { labels, datasets } = chartData;

  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;

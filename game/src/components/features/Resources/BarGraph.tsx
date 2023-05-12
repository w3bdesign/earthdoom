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
        text: "Income",
      },
    },
  };

  return (
    <div className="flex md:h-[16rem] items-center justify-center px-4 py-4">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;

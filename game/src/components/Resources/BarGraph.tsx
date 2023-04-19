import { Bar } from "react-chartjs-2";

interface BarGraphProps {
  title: string;
  width: number;
  data: string;
}

function BarGraph({ title, width, data }: BarGraphProps) {
  const items = data.split("^^");

  const values: number[] = [];
  const labels: string[] = [];

  let total = 0;
  let max = 0;

  items.forEach((item) => {
    const [itemTitle, value] = item.split("^");
    if (itemTitle) {
      labels.push(itemTitle);
    }

    if (value) {
      values.push(parseInt(value, 10));
      total += parseInt(value, 10);
      max = Math.max(max, parseInt(value, 10));
    }
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Value",
        data: values,
        backgroundColor: "rgba(64,100,168,0.8)",
      },
    ],
  };

  return (
    <div>
      <h2>{title}</h2>
      <Bar data={chartData} width={width} height={300} />
      <p>Total: {total}</p>
    </div>
  );
}

export default BarGraph;

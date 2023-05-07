interface CombatReportProps {
  data: {
    title: string;
    defenders: Record<string, { total: number; lost: string }>;
    attackers: Record<string, { total: number; lost: string }>;
    yours: Record<string, string | number>;
  };
}

interface Props {
  data: {
    news: {
      id: number;
      sentTo: number;
      time: number;
      news: string;
      seen: string;
      header: string;
    }[];
  };
}

const CombatReport = ({ data }: Props) => {
  console.log("Combatreport news: ", data);

  //if (!data) return;

  const tableHtml = `
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Defenders</th>
        <th>Attackers</th>
        <th>Yours</th>
        <th>Time</th>
        <th>Seen</th>
        <th>Header</th>
      </tr>
    </thead>
    <tbody>
      ${data.news
        .map(
          (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${JSON.parse(item.news).title}</td>
          <td>${JSON.stringify(JSON.parse(item.news).defenders)}</td>
          <td>${JSON.stringify(JSON.parse(item.news).attackers)}</td>
          <td>${JSON.stringify(JSON.parse(item.news).yours)}</td>
          <td>${item.time}</td>
          <td>${item.seen}</td>
          <td>${item.header}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
`;




  return(<h1>Test: {tableHtml}</h1>)
};

export default CombatReport;

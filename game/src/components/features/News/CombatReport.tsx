interface CombatReportProps {
  data: {
    title: string;
    defenders: Record<string, { total: number; lost: string }>;
    attackers: Record<string, { total: number; lost: string }>;
    yours: Record<string, string | number>;
  };
}

const CombatReport = ({ data }: CombatReportProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th colSpan={Object.keys(data.defenders).length}>Defenders</th>
          <th colSpan={Object.keys(data.attackers).length}>Attackers</th>
          <th colSpan={Object.keys(data.yours).length}>Yours</th>
        </tr>
        <tr>
          {Object.entries(data.defenders).map(([key, value]) => (
            <th key={key}>{key}</th>
          ))}
          {Object.entries(data.attackers).map(([key, value]) => (
            <th key={key}>{key}</th>
          ))}
          {Object.entries(data.yours).map(([key, value]) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {Object.entries(data.defenders).map(([key, value]) => (
            <td key={key}>{value.total}</td>
          ))}
          {Object.entries(data.attackers).map(([key, value]) => (
            <td key={key}>{value.total}</td>
          ))}
          {Object.entries(data.yours).map(([key, value]) => (
            <td key={key}>{value}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default CombatReport;

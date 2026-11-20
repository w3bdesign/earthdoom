interface CombatReportProps {
  title: string;
  defenders: {
    [key: string]: {
      total: number;
      lost: string;
    };
  };
  attackers: {
    [key: string]: {
      total: number;
      lost: string;
    };
  };
  yours: {
    [key: string]: number | string;
  };
  land: {
    [key: string]: number | string;
  };

  time: string;
}

const SECTION_ROW = "bg-raised text-xs font-medium text-muted";
const CELL = "px-4 py-2";

const CombatReport: React.FC<CombatReportProps> = ({
  title,
  defenders,
  attackers,
  yours,
  land,
  time,
}) => {
  const renderRow = (name: string, data: { total: number; lost: string }) => (
    <tr key={name} className="border-t border-line">
      <td className={CELL}>{name}</td>
      <td className={`${CELL} text-right tabular-nums`}>{data.total}</td>
      <td className={`${CELL} text-right tabular-nums text-hostile`}>
        {data.lost}
      </td>
    </tr>
  );

  const renderValueRow = (name: string, value: number | string) => (
    <tr key={name} className="border-t border-line">
      <td className={CELL}>{name}</td>
      <td className={`${CELL} text-right tabular-nums`}>{value}</td>
      <td className={CELL} />
    </tr>
  );

  const section = (label: string) => (
    <tr className={SECTION_ROW}>
      <th scope="rowgroup" colSpan={3} className={`${CELL} text-left`}>
        {label}
      </th>
    </tr>
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-panel shadow-panel">
      <table className="w-full text-left text-sm">
        <caption className="border-b border-line px-4 py-3 text-left text-base font-semibold [font-stretch:112%]">
          {title} <span className="text-sm font-normal text-muted">{time}</span>
        </caption>
        <thead>
          <tr className="text-xs text-muted">
            <th scope="col" className={CELL}>
              Unit
            </th>
            <th scope="col" className={`${CELL} text-right`}>
              Total
            </th>
            <th scope="col" className={`${CELL} text-right`}>
              Lost
            </th>
          </tr>
        </thead>
        <tbody>
          {section("Defenders")}
          {Object.entries(defenders).map(([name, data]) =>
            renderRow(name, data),
          )}
          {section("Attackers")}
          {Object.entries(attackers).map(([name, data]) =>
            renderRow(name, data),
          )}
          {section("Yours")}
          {Object.entries(yours).map(([name, value]) =>
            renderValueRow(name, value),
          )}
          {section("Land captures")}
          {Object.entries(land).map(([name, value]) =>
            renderValueRow(name, value),
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CombatReport;

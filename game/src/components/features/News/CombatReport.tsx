export interface CombatReportProps {
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

const CombatReport: React.FC<CombatReportProps> = ({
  title,
  defenders,
  attackers,
  yours,
  land,
  time,
}) => {
  const renderRow = (name: string, data: { total: number; lost: string }) => (
    <tr className="block border-b p-4 last:border-b-0 sm:table-row sm:border-none md:p-0">
      <td className="h-12 w-[6.25rem] text-center text-base text-black transition duration-300  before:font-medium before:text-black first:border-l-0 sm:border-l sm:border-t">
        {name}
      </td>
      <td className="h-12 w-[6.25rem] text-center text-base text-black transition duration-300  before:font-medium before:text-black first:border-l-0 sm:border-l sm:border-t">
        {data.total}
      </td>
      <td className="h-12 w-[6.25rem] text-center text-base text-black transition duration-300  before:font-medium before:text-black first:border-l-0 sm:border-l sm:border-t">
        {data.lost}
      </td>
    </tr>
  );

  return (
    <table className="py-6 text-left ring-1 ring-slate-400/10 md:w-full">
      <caption className="bg-slate-400/90 py-4 text-center text-xl font-bold text-black">
        {title} - {time}
      </caption>
      <thead>
        <tr className="block border-b bg-white p-4 last:border-b-0 sm:table-row sm:border-none md:p-0">
          <th className="h-12 px-6 text-center text-base font-bold text-black first:border-l-0 sm:table-cell pl-[2.2rem] md:pl-4">
            Unit
          </th>
          <th className="h-12  px-6 text-center text-base font-bold text-black first:border-l-0 sm:table-cell pl-[2.2rem] md:pl-4">
            Total
          </th>
          <th className="h-12  px-6 text-center text-base font-bold text-black first:border-l-0 sm:table-cell pl-[2.2rem] md:pl-4">
            Lost
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="block last:border-b-0 sm:table-row sm:border-none md:p-0">
          <td className="flex h-12 items-center bg-slate-300/90 px-6 text-center text-base font-bold text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black  first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
            Defenders
          </td>
          <td className="bg-slate-300/90"></td>
          <td className="bg-slate-300/90"></td>
        </tr>
        {Object.entries(defenders).map(([name, data]) => renderRow(name, data))}
        <tr className="block last:border-b-0 sm:table-row sm:border-none md:p-0">
          <td className="flex h-12 items-center bg-slate-300/90 px-6 text-center text-base font-bold text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black  first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
            Attackers
          </td>
          <td className="bg-slate-300/90"></td>
          <td className="bg-slate-300/90"></td>
        </tr>
        {Object.entries(attackers).map(([name, data]) => renderRow(name, data))}
        <tr className="block last:border-b-0 sm:table-row sm:border-none md:p-0">
          <td className="flex h-12  items-center bg-slate-300/90 px-6 text-center text-base font-bold text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black  first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
            Yours
          </td>
          <td className="bg-slate-300/90"></td>
          <td className="bg-slate-300/90"></td>
        </tr>
        {Object.entries(yours).map(([name, value]) => (
          <tr
            className="block border-b p-4 last:border-b-0 sm:table-row sm:border-none md:p-0"
            key={name}
          >
            <td className="h-12  w-[6.25rem] text-center text-base text-black transition duration-300  before:font-medium before:text-black first:border-l-0 sm:border-l sm:border-t">
              {name}
            </td>
            <td className="h-12  w-[6.25rem] text-center text-base text-black transition duration-300  before:font-medium before:text-black first:border-l-0 sm:border-l sm:border-t">
              {value}
            </td>
          </tr>
        ))}
        <tr className="block last:border-b-0 sm:table-row sm:border-none md:p-0">
          <td className="flex h-12 items-center bg-slate-300/90 px-6 text-center text-base font-bold text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black  first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
            Land captures
          </td>
          <td className="bg-slate-300/90"></td>
          <td className="bg-slate-300/90"></td>
        </tr>
        {Object.entries(land).map(([name, value]) => (
          <tr
            className="block border-b p-4 last:border-b-0 sm:table-row sm:border-none md:p-0"
            key={name}
          >
            <td className="h-12  w-[6.25rem] text-center text-base text-black transition duration-300  before:font-medium before:text-black first:border-l-0 sm:border-l sm:border-t">
              {name}
            </td>
            <td className="h-12  w-[6.25rem] text-center text-base text-black transition duration-300  before:font-medium before:text-black first:border-l-0 sm:border-l sm:border-t">
              {value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CombatReport;

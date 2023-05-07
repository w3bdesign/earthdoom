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
}

const TestReport: React.FC<CombatReportProps> = ({
  title,
  defenders,
  attackers,
  yours,
}) => {
  const renderRow = (name: string, data: { total: number; lost: string }) => (
    <tr key={name}>
      <td className="flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
        {name}
      </td>
      <td className="flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
        {data.total}
      </td>
      <td className="flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
        {data.lost}
      </td>
    </tr>
  );

  return (
    <table className="w-[20.625rem] py-6 text-left ring-1 ring-slate-400/10 md:w-full">
      <caption className="py-4 text-center text-xl font-bold text-black">
        {title}
      </caption>
      <thead>
        <tr className="block border-b bg-white p-4 last:border-b-0 sm:table-row sm:border-none md:p-0">
          <th className="hidden h-12 bg-slate-200/90 px-6 text-center text-base font-bold text-black first:border-l-0 sm:table-cell">
            Unit
          </th>
          <th className="hidden h-12 bg-slate-200/90 px-6 text-center text-base font-bold text-black first:border-l-0 sm:table-cell">
            Total
          </th>
          <th className="hidden h-12 bg-slate-200/90 px-6 text-center text-base font-bold text-black first:border-l-0 sm:table-cell">
            Lost
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="block border-b p-4 last:border-b-0 sm:table-row sm:border-none md:p-0">
          <td className="flex h-12 items-center bg-slate-400/90 px-6 text-center text-base font-bold text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
            Defenders
          </td>
          <td className="bg-slate-400/90"></td>
          <td className="bg-slate-400/90"></td>
        </tr>
        {Object.entries(defenders).map(([name, data]) => renderRow(name, data))}
        <tr className="mt-4 block border-b p-4 last:border-b-0 sm:table-row sm:border-none md:p-0">
          <td className="mt-4 flex h-12 items-center bg-slate-400/90 px-6 text-center text-base font-bold text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
            Attackers
          </td>
          <td className="bg-slate-400/90"></td>
          <td className="bg-slate-400/90"></td>
        </tr>
        {Object.entries(attackers).map(([name, data]) => renderRow(name, data))}
        <tr className="block border-b bg-white p-4 last:border-b-0 sm:table-row sm:border-none md:p-0">
          <td className="flex font-bold h-12 items-center bg-slate-400/90 px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
            Yours
          </td>
          <td className="bg-slate-400/90"></td>
          <td className="bg-slate-400/90"></td>
        </tr>
        {Object.entries(yours).map(([name, value]) => (
          <tr
            className="block bg-white p-4 last:border-b-0 sm:table-row sm:border-none md:p-0"
            key={name}
          >
            <td className=" border-r flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
              {name}
            </td>
            <td className="border-r flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
              {value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TestReport;

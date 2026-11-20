import { LuShieldAlert, LuShieldCheck } from "react-icons/lu";

import Panel from "@/components/ui/Panel";
import Skeleton from "@/components/ui/Skeleton";

interface INewsProps {
  isLoading: boolean;
  hostiles?: string;
  friendlies?: string;
}

/** The router joins one line per fleet with "\n". */
const lines = (text?: string) =>
  (text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const FleetRow = ({ text, hostile }: { text: string; hostile: boolean }) => {
  const Icon = hostile ? LuShieldAlert : LuShieldCheck;
  return (
    <li className="flex items-start gap-3 px-4 py-3 text-sm text-ink">
      <Icon
        aria-hidden
        className={`mt-0.5 h-4 w-4 shrink-0 ${hostile ? "text-hostile" : "text-friendly"}`}
      />
      <span className="sr-only">{hostile ? "Hostile: " : "Friendly: "}</span>
      <span className="min-w-0">{text}</span>
    </li>
  );
};

export const RenderIncoming = ({
  isLoading,
  hostiles,
  friendlies,
}: INewsProps) => {
  const hostileLines = lines(hostiles);
  const friendlyLines = lines(friendlies);
  const count = hostileLines.length + friendlyLines.length;

  return (
    <Panel
      title="Fleet movements"
      meta={
        isLoading ? undefined : `${count} ${count === 1 ? "fleet" : "fleets"}`
      }
      flush
    >
      {isLoading ? (
        <div className="space-y-2 p-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      ) : count === 0 ? (
        <p className="px-4 py-6 text-sm text-muted">
          No fleets are moving in your continent right now.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {hostileLines.map((text) => (
            <FleetRow key={`h-${text}`} text={text} hostile />
          ))}
          {friendlyLines.map((text) => (
            <FleetRow key={`f-${text}`} text={text} hostile={false} />
          ))}
        </ul>
      )}
    </Panel>
  );
};

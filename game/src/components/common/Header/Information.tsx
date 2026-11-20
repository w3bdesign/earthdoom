import { useUser } from "@clerk/nextjs";
import Link from "next/link";

import type { PaPlayer } from "@/types/player";

import { api } from "@/utils/api";
import Alert from "@/components/ui/Alert";

import ResourceBar from "./ResourceBar";

interface InformationProps {
  paPlayer?: PaPlayer;
}

const lines = (text: string) => text.split("\n").filter(Boolean);

/**
 * The resource bar and the alerts every page shows: incoming fleets and newbie protection.
 * Unread mail is shown as a badge in the navigation.
 */
const Information: React.FC<InformationProps> = ({ paPlayer }) => {
  const { user } = useUser();
  const nick = user?.username ?? "";

  const { data: hostilesData } = api.paUsers.getHostiles.useQuery(
    { nick },
    { enabled: !!nick },
  );
  const { data: friendliesData } = api.paUsers.getFriendlies.useQuery(
    { nick },
    { enabled: !!nick },
  );

  if (!nick || !paPlayer) {
    return null;
  }

  const hostiles = hostilesData?.hostiles ? lines(hostilesData.hostiles) : [];
  const defenders = friendliesData?.defenders
    ? lines(friendliesData.defenders)
    : [];
  const protectedTicks = Number(paPlayer.newbie ?? 0);
  const hasAlerts =
    hostiles.length > 0 || defenders.length > 0 || protectedTicks > 0;

  return (
    <>
      <ResourceBar paPlayer={paPlayer} />
      {hasAlerts && (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 pt-4 md:px-8">
          {hostiles.length > 0 && (
            <Alert
              tone="hostile"
              title={
                hostiles.length === 1
                  ? "Hostile fleet incoming"
                  : `${hostiles.length} hostile fleets incoming`
              }
              action={
                <Link
                  href="/military"
                  className="text-sm font-semibold text-hostile underline-offset-4 hover:underline"
                >
                  Military
                </Link>
              }
            >
              {hostiles.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </Alert>
          )}
          {defenders.length > 0 && (
            <Alert
              tone="friendly"
              title={
                defenders.length === 1
                  ? "Friendly fleet incoming"
                  : `${defenders.length} friendly fleets incoming`
              }
            >
              {defenders.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </Alert>
          )}
          {protectedTicks > 0 && (
            <div className="sm:hidden">
              <Alert
                tone="info"
                title={`You are under protection for ${protectedTicks} more ticks`}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Information;

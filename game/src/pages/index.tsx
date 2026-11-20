import { Layout } from "@/components/common/Layout";
import LandTable from "@/components/ui/tables/LandTable";
import { SHIPS } from "@/components/ui/tables/UnitsTable";
import FleetStatus from "@/components/ui/tables/FleetTable";
import InProgress from "@/components/features/Overview/InProgress";
import PageHeader from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import Panel from "@/components/ui/Panel";
import StatList from "@/components/ui/StatList";

import { api } from "@/utils/api";
import { formatNumber, getShipCount } from "@/utils/functions";
import { useUser } from "@clerk/nextjs";

/**
 * Renders the Home page with player data if signed in, otherwise displays a loading skeleton.
 *
 * @returns {JSX.Element} The Home page with player data or a loading skeleton.
 */
const Home = () => {
  const { user, isSignedIn } = useUser();

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery(
    { nick: user?.username ?? "" },
    { enabled: !!isSignedIn && !!user?.username },
  );

  if (!isSignedIn || !user?.username) {
    return null;
  }

  if (!paPlayer) {
    return (
      <Layout>
        <PageSkeleton />
      </Layout>
    );
  }

  const shipCount = getShipCount(paPlayer);
  const bduCount = paPlayer.rcannons + paPlayer.avengers + paPlayer.lstalkers;

  return (
    <Layout paPlayer={paPlayer}>
      <PageHeader
        title="Overview"
        description={`${paPlayer.tag ? `[${paPlayer.tag}] ` : ""}${paPlayer.nick} · rank ${paPlayer.rank}`}
      />
      {/* Panels in the same row stretch to the same height */}
      <div className="grid gap-4 lg:grid-cols-2">
        <FleetStatus paPlayer={paPlayer} />
        <LandTable paPlayer={paPlayer} />
        <div className="lg:col-span-2">
          <InProgress paPlayer={paPlayer} />
        </div>
        <Panel
          className="lg:col-span-2"
          title="Forces"
          meta={`${formatNumber(shipCount + bduCount)} total`}
        >
          <div className="grid gap-6 md:grid-cols-2 md:gap-10">
            <div>
              <h3 className="mb-2 text-xs font-medium text-muted [font-stretch:100%]">
                Units · {formatNumber(shipCount)}
              </h3>
              <StatList
                label="Units"
                stats={SHIPS.map(({ label, field }) => ({
                  label,
                  value: Number(paPlayer[field]),
                }))}
              />
            </div>
            <div>
              <h3 className="mb-2 text-xs font-medium text-muted [font-stretch:100%]">
                Base defence · {formatNumber(bduCount)}
              </h3>
              <StatList
                label="Base defence"
                stats={[
                  { label: "Reaper cannons", value: paPlayer.rcannons },
                  { label: "Avengers", value: paPlayer.avengers },
                  { label: "Lucius stalkers", value: paPlayer.lstalkers },
                ]}
              />
            </div>
          </div>
        </Panel>
      </div>
    </Layout>
  );
};

export default Home;

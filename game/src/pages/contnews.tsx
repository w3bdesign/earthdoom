import { useUser } from "@clerk/nextjs";

import type { NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import { PageHeader, RenderIncoming } from "@/components/ui";

/**
 * Returns a Next.js page component that displays incoming continent news for a signed-in user.
 *
 * @return {JSX.Element} A React component that renders incoming continent news.
 */
const ContNews: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) {
    return null;
  }

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  const { data: paNews, isLoading } = api.paUsers.getContinentIncoming.useQuery(
    {
      nick: user.username,
    },
  );

  if (!paPlayer) {
    return null;
  }

  return (
    <>
      <Layout paPlayer={paPlayer}>
        <PageHeader
          title="Continent news"
          description="Attacks and defence fleets heading for players in your continent."
        />
        <RenderIncoming
          isLoading={isLoading}
          hostiles={paNews?.hostiles}
          friendlies={paNews?.friendly}
        />
      </Layout>
    </>
  );
};

export default ContNews;

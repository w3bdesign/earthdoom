import { useUser } from "@clerk/nextjs";

import type { NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import Alliance from "@/components/features/Alliance";
import { PageSkeleton } from "@/components/ui/Skeleton";

/**
 * Renders the Alliance page if the user is signed in and has a username.
 *
 * @return {JSX.Element} The rendered Alliance page.
 */
const AlliancePage: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) {
    return null;
  }

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  const { data: paTag, isLoading } = api.paTag.getAll.useQuery();

  if (!paPlayer) {
    return (
      <Layout>
        <PageSkeleton />
      </Layout>
    );
  }

  return (
    <>
      <Layout paPlayer={paPlayer}>
        {isLoading && <PageSkeleton />}
        {paPlayer && paTag && <Alliance paPlayer={paPlayer} paTag={paTag} />}
      </Layout>
    </>
  );
};

export default AlliancePage;

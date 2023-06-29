import { useUser } from "@clerk/nextjs";

import type { NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import Alliance from "@/components/features/Alliance";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

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
        <div className="mt-12">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout paPlayer={paPlayer}>
        <div className="container mb-6 flex flex-col items-center justify-center text-white">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <div className="relative sm:mx-auto">
              {isLoading && <LoadingSpinner />}
              {paPlayer && paTag && (
                <Alliance paPlayer={paPlayer} paTag={paTag} />
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AlliancePage;

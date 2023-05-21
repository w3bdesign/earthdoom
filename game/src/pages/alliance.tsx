import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import Alliance from "@/components/features/Alliance";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

const AlliancePage: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  const { data: paTag, isLoading } = api.paTag.getAll.useQuery();

  if (!paPlayer) return <LoadingSpinner />;

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

import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import Alliance from "@/components/features/Alliance";

const AlliancePage: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    nick: user.username,
  });

  const { data: paTag } = api.paTag.getAll.useQuery();

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center text-white">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <div className="relative py-4 sm:mx-auto"></div>
            {paPlayer && paTag && (
              <Alliance paPlayer={paPlayer} paTag={paTag} />
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AlliancePage;

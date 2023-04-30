import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import Layout from "@/components/common/Layout/Layout";
import Research from "@/components/features/Research/Research";

import { api } from "@/utils/api";

const ResearchPage: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    nick: user.username,
  });

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center px-2 py-2 ">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <div className="relative py-4 sm:mx-auto">
              {paPlayer && <Research paPlayer={paPlayer} />}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ResearchPage;

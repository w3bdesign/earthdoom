import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";
import Research from "@/components/Research/Research";

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
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-center text-2xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            Research
          </h1>
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
            <div className="relative sm:mx-auto">
              {paPlayer && <Research paPlayer={paPlayer} />}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ResearchPage;

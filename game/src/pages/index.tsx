import { getAuth, buildClerkProps, clerkClient } from "@clerk/nextjs/server";

import { GetServerSideProps } from "next";

import Layout from "@/components/Layout/Layout";
import LandTable from "@/components/Index/LandTable";
import BDUTable from "@/components/Index/BDUTable";
import UnitsTable from "@/components/Index/UnitsTable";
import FleetStatus from "@/components/Index/FleetStatus";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";

import { api } from "@/utils/api";

import { generateSSGHelper } from "@/server/helpers/ssgHelper";

interface IHomeProps {
  username: string;
}

const Home = ({ username }: IHomeProps) => {
  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    nick: username,
  });

  if (!username) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 text-white">
        <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
          <h1 className="text-center text-2xl">Main</h1>
          <div className="relative sm:mx-auto">
            {paPlayer ? (
              <>
                <UnitsTable paPlayer={paPlayer} />
                <BDUTable paPlayer={paPlayer} />
                <LandTable paPlayer={paPlayer} />
                <FleetStatus paPlayer={paPlayer} />
              </>
            ) : (
              <div className="py-6">
                <LoadingSpinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const ssg = generateSSGHelper();

  const { userId } = getAuth(req);

  const userid = clerkClient.users.getUser(userId!);

  const username = (await userid).username || "killah";

  await ssg.paUsers.getPlayerById.prefetch({
    nick: username,
  });

  return {
    props: {
      ...buildClerkProps(req),
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

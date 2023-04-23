import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";
import Construct from "@/components/Construct/Construct";

import { api } from "@/utils/api";

const Construction: NextPage = () => {
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
              {paPlayer && <Construct paPlayer={paPlayer} />}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Construction;

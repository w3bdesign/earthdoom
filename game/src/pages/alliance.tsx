import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";
import Alliance from "@/components/Alliance/Alliance";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";

const AlliancePage: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    nick: user.username,
  });
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center text-white">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <div className="relative py-4 sm:mx-auto"></div>
            {paPlayer && <Alliance paPlayer={paPlayer} />}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AlliancePage;

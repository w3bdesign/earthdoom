import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { api } from "@/utils/api";

import Layout from "@/components/Layout/Layout";

import RenderNews from "@/components/common/RenderNews";

const ContNews: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paNews, isLoading } = api.paUsers.getContinentIncoming.useQuery(
    {
      nick: user.username,
    }
  );

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center px-2 py-2 ">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <RenderNews
              isLoading={isLoading}
              hostiles={paNews?.hostiles}
              friendlies={paNews?.friendly}
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ContNews;

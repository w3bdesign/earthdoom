import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import { RenderIncoming } from "@/components/ui";

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
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 ">
            <RenderIncoming
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

import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import { RenderIncoming } from "@/components/ui";

/**
 * Returns a Next.js page component that displays incoming continent news for a signed-in user.
 *
 * @return {JSX.Element} A React component that renders incoming continent news.
 */
const ContNews: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  const { data: paNews, isLoading } = api.paUsers.getContinentIncoming.useQuery(
    {
      nick: user.username,
    }
  );

  if (!paPlayer) return null;

  return (
    <>
      <Layout paPlayer={paPlayer}>
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

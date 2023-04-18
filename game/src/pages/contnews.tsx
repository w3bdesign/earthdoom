import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { api } from "@/utils/api";

import Layout from "@/components/Layout/Layout";
import ContNewsTable from "@/components/ContNews/ContNewsTable";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";

interface IRenderContentProps {
  hostiles?: string;
  friendlies?: string;
}

interface IRenderContentProps {
  hostiles?: string;
  friendlies?: string;
}

const HostileNews = ({ content }: { content: string }) => {
  return <div className="text-red-500">{content}</div>;
};

const FriendlyNews = ({ content }: { content: string }) => {
  return <div className="text-green-500">{content}</div>;
};

const renderContent = (isLoading: boolean, paNews?: IRenderContentProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  const hasNews = paNews && (paNews.hostiles || paNews.friendlies);
  if (hasNews) {
    return (
      <div className="p-4">
        {paNews?.hostiles && <HostileNews content={paNews.hostiles} />}
        {paNews?.friendlies && <FriendlyNews content={paNews.friendlies} />}
      </div>
    );
  }

  return (
    <h1 className="text-bold p-4 text-center text-2xl text-black">
      No continent news to report
    </h1>
  );
};

const ContNews: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paNews, isLoading } = api.paUsers.getContinentIncoming.useQuery(
    {
      nick: user.username,
    }
  );

  const input =
    '{"hostiles":"Hostile incoming fleet: fiende #1 (ETA: 25)","friendly":"Friendly incoming fleet: venn #2 (ETA: 0)"}';
  const parsedInput = JSON.parse(input);

  //return renderContent(isLoading, parsedInput);

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <div className="mt-8 flex min-w-[520px] flex-col bg-white text-black">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-center overflow-hidden">
                    {renderContent(isLoading, paNews)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ContNews;

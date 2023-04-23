import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";
import { type PaNews } from "@prisma/client";

import { api } from "@/utils/api";

import Layout from "@/components/Layout/Layout";
import NewsTable from "@/components/News/NewsTable";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";

interface IRenderContentProps {
  news?: PaNews[];
}

const renderContent = (isLoading: boolean, paNews?: IRenderContentProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  const hasNews = paNews?.news?.length ?? 0 > 0;
  if (hasNews) {
    return <NewsTable news={paNews?.news ?? []} />;
  }

  return (
    <h1 className="text-bold p-4 text-center text-2xl text-black">
      No news to report
    </h1>
  );
};

const News: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paNews, isLoading } = api.paNews.getAllNewsByUserId.useQuery({
    nick: user.username,
  });

  return (
    <>
      <Layout>
      <div className="container flex flex-col items-center justify-center px-2 py-2 ">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
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

export default News;

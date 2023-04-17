import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { api } from "@/utils/api";

import Layout from "@/components/Layout/Layout";
import NewsTable from "@/components/News/NewsTable";

const News: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paNews } = api.paNews.getAllNewsByUserId.useQuery({
    nick: user.username,
  });

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <div className="mt-8 flex flex-col bg-white text-black">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    {paNews?.news && paNews.news.length > 0 ? (
                      <NewsTable paNews={paNews} />
                    ) : (
                      <h1 className="text-center text-2xl text-bold text-black p-4">
                        No news to report
                      </h1>
                    )}
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

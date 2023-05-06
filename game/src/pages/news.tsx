import { useUser } from "@clerk/nextjs";

import type { NextPage } from "next";
import type { PaNews } from "@prisma/client";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";
import NewsTable from "@/components/features/News/NewsTable";
import { Button, ToastComponent } from "@/components/ui/common";

interface IRenderContentProps {
  news?: PaNews[];
}

const renderNews = (isLoading: boolean, paNews: IRenderContentProps) => {
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
  const ctx = api.useContext();
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paNews, isLoading } = api.paNews.getAllNewsByUserId.useQuery({
    nick: user.username,
  });

  const { mutate: deleteAllNews, isLoading: isDeleting } =
    api.paNews.deleteAllNews.useMutation({
      onSuccess: () => {
        ToastComponent({ message: "News deleted", type: "success" });
        ctx.paNews.getAllNewsByUserId.invalidate();
        ctx.paNews.getAllNewsByUserId.refetch();
      },
      onError: () => {
        ToastComponent({ message: "Database error", type: "error" });
      },
    });

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden">
            <div className="container mt-6 flex justify-end">
              {paNews && paNews.news.length > 0 && (
                <Button
                  disabled={isDeleting}
                  variant="danger"
                  onClick={() => {
                    if (!user || !user.username) return;
                    deleteAllNews({ nick: user.username });
                  }}
                >
                  Delete All
                </Button>
              )}
            </div>
            <div className="mt-4 flex min-w-[20.5rem] flex-col bg-white text-black">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="flex items-center justify-center overflow-hidden">
                    {paNews && renderNews(isLoading, paNews)}
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

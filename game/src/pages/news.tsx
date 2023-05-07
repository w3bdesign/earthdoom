import { useUser } from "@clerk/nextjs";

import type { NextPage } from "next";
import type { PaNews } from "@prisma/client";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";
import NewsTable from "@/components/features/News/NewsTable";
import { Button, ToastComponent } from "@/components/ui/common";
import { CombatReport } from "@/components/features/News";

interface IRenderContentProps {
  news?: PaNews[];
}

const renderNews = (
  isLoading: boolean,
  paNews: IRenderContentProps,
  isDeletingAll: boolean
) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  const hasNews = paNews?.news?.length ?? 0 > 0;
  if (hasNews) {
    return (
      <NewsTable isDeletingAll={isDeletingAll} news={paNews?.news ?? []} />
    );
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

  const { mutate: deleteAllNews, isLoading: isDeletingAll } =
    api.paNews.deleteAllNews.useMutation({
      onSuccess: async () => {
        ToastComponent({ message: "News deleted", type: "success" });
        await ctx.paNews.getAllNewsByUserId.invalidate();
        await ctx.paNews.getAllNewsByUserId.refetch();
      },
      onError: () => {
        ToastComponent({ message: "Database error", type: "error" });
      },
    });

  const data = {
    title: "Combat report",
    defenders: {
      "Light Infantry": { total: 0, lost: "0" },
      Shadows: { total: 645, lost: "0" },
      Goliaths: { total: 235, lost: "0" },
      Hellspawns: { total: 23, lost: "0" },
      Medusas: { total: 0, lost: "0" },
      Grabbers: { total: 0, lost: "0" },
      Ares: { total: 0, lost: "0" },
    },
    attackers: {
      "Light Infantry": { total: 0, lost: "0" },
      Shadows: { total: 0, lost: "0" },
      Goliaths: { total: 0, lost: "0" },
      Hellspawns: { total: 0, lost: "0" },
      Grabbers: { total: 0, lost: "0" },
      Ares: { total: 0, lost: "0" },
    },
    yours: {
      "Light Infantry": 0,
      Shadows: 645,
      Goliaths: 235,
      Hellspawns: 23,
      Medusas: "0",
      Grabbers: 0,
      Ares: 0,
    },
  };

  const combatReports = paNews?.news.map((report) => {
    const news = JSON.parse(report.news);

    console.log("Json News er: ", news);

    if (news.title !== "Combat report") {
      return;
    }

    return {
      title: news.title,
      defenders: news.defenders,
      attackers: news.attackers,
      yours: news.yours,
    };
  });

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden">
            <div className="container mt-6 flex justify-end">
              {paNews && paNews.news.length > 0 && (
                <Button
                  disabled={isDeletingAll}
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
                    {paNews && renderNews(isLoading, paNews, isDeletingAll)}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex min-w-[20.5rem] flex-col bg-white text-black">
              {combatReports &&
                combatReports.map((report: any, index) => (
                  <CombatReport
                    key={index}
                    title={report.title}
                    defenders={report.defenders}
                    attackers={report.attackers}
                    yours={report.yours}
                  />
                ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default News;

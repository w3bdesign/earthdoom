import { useUser } from "@clerk/nextjs";
import Link from "next/link";

import type { PaPlayer } from "@/components/features/Military/Military";

import { api } from "@/utils/api";

import OverviewTable from "./OverviewTable";
import LoadingSpinner from "../Loader/LoadingSpinner";

interface InformationProps {
  paPlayer?: PaPlayer;
}

const Information: React.FC<InformationProps> = ({ paPlayer }) => {
  const { user } = useUser();

  if (!user?.username) {
    return null;
  }

  const { data: hostilesData, isLoading } = api.paUsers.getHostiles.useQuery({
    nick: user.username,
  });

  const { data: friendliesData } = api.paUsers.getFriendlies.useQuery({
    nick: user.username,
  });

  const { data: paUnseenMail } = api.paMail.getUnseenMailByUserId.useQuery({
    nick: user.username,
  });

  if (!paPlayer) {
    return null;
  }

  return (
    <>
      <div className="mt-4 flex w-full flex-col items-center justify-center gap-12 px-4 py-4 text-white">
        <div className="flex flex-col items-center gap-2 text-center text-lg md:w-[44.5625rem]">
          {isLoading && <LoadingSpinner />}
          {hostilesData?.hostiles && (
            <div
              className="mb-4 rounded-lg bg-red-300 px-6 py-5 text-base text-black md:min-w-[30.625rem]"
              role="alert"
            >
              {/* Split the hostiles string into an array of lines */}
              {hostilesData.hostiles.split("\n").map((line, index) => (
                <div className="text-left" key={index}>
                  {line}
                </div>
              ))}
            </div>
          )}
          {friendliesData?.defenders && (
            <div
              className="mb-4 rounded-lg bg-green-300 px-6 py-5 text-base text-black md:min-w-[30.625rem]"
              role="alert"
            >
              {/* Split the defenders string into an array of lines */}
              {friendliesData.defenders.split("\n").map((line, index) => (
                <div className="text-left" key={index}>
                  {line}
                </div>
              ))}
            </div>
          )}
          {paUnseenMail?.email?.length && paUnseenMail?.email?.length > 0 ? (
            <div
              className="mb-4 min-w-[27.125rem] rounded-lg bg-secondary-100 px-6 py-5 text-base text-secondary-800 md:min-w-[30.375rem]"
              role="alert"
            >
              <Link href="/mail" className="font-bold text-info-800">
                You have unread email
              </Link>
            </div>
          ) : (
            ""
          )}
          {paPlayer?.newbie > 0 && (
            <div
              className="mb-4 rounded-lg bg-blue-100 px-6 py-5 text-base text-blue-800 md:min-w-[30.625rem]"
              role="alert"
            >
              You are under protection for {paPlayer.newbie} more ticks
            </div>
          )}
          {paPlayer && <OverviewTable paPlayer={paPlayer} />}
        </div>
      </div>
    </>
  );
};

export default Information;

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

import { api } from "@/utils/api";

import OverviewTable from "./OverviewTable";
import LoadingSpinner from "../Loader/LoadingSpinner";

const Information = () => {
  // TODO See if we can get the user from the session instead of making a request
  // TODO Maybe we can use the user from the session to get the paPlayer data
  // TODO Right now these queries take too long

  const { user, isLoaded } = useUser();

  const { data: paPlayer } = api.paUsers.getResourceOverview.useQuery({
    nick: isLoaded && user?.username ? user.username : "",
  });

  const { data: hostilesData, isLoading } = api.paUsers.getHostiles.useQuery({
    nick: isLoaded && user?.username ? user.username : "",
  });

  const { data: friendliesData } = api.paUsers.getFriendlies.useQuery({
    nick: isLoaded && user?.username ? user.username : "",
  });

  const { data: paMail } = api.paMail.getUnseenMailByUserId.useQuery({
    nick: isLoaded && user?.username ? user.username : "",
  });

  return (
    <>
      <div className="mt-4 flex w-full flex-col items-center justify-center gap-12 px-4 py-4 text-white">
        <div className="flex flex-col items-center gap-2 text-center text-lg">
          <div className="-mt-8 mb-8">
            {paPlayer && <OverviewTable paPlayer={paPlayer} />}
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div
              className="mb-4 rounded-lg bg-danger-100 px-6 py-5 text-base text-black md:min-w-[486px]"
              role="alert"
            >
              {/* Split the hostiles string into an array of lines */}
              {hostilesData?.hostiles &&
                hostilesData.hostiles.split("\n").map((line, index) => (
                  <div className="text-left" key={index}>
                    {line}
                  </div>
                ))}
            </div>
          )}

          {friendliesData?.defenders && (
            <div
              className="mb-4 rounded-lg bg-success-100 px-6 py-5 text-base text-black md:min-w-[486px]"
              role="alert"
            >
              {/* Split the defenders string into an array of lines */}
              {friendliesData.defenders &&
                friendliesData.defenders.split("\n").map((line, index) => (
                  <div className="text-left" key={index}>
                    {line}
                  </div>
                ))}
            </div>
          )}

          {paMail?.email?.length && paMail?.email?.length > 0 ? (
            <div
              className="mb-4 min-w-[434px] rounded-lg bg-secondary-100 px-6 py-5 text-base text-secondary-800 md:min-w-[486px]"
              role="alert"
            >
              <Link href="/mail" className="font-bold text-info-800">
                You have unread email
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Information;

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

import { api } from "@/utils/api";
import LoadingSpinner from "../Loader/LoadingSpinner";

const Information = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: hostilesData } = api.paUsers.getHostiles.useQuery({
    nick: user.username,
  });

  const { data: friendliesData } = api.paUsers.getFriendlies.useQuery({
    nick: user.username,
  });

  const { data: paMail } = api.paMail.getUnseenMailByUserId.useQuery({
    nick: user.username,
  });

  return (
    <>
      <div className="mt-4 flex w-full flex-col items-center justify-center gap-12 px-4 py-4 text-white">
        <div className="flex flex-col items-center gap-2 text-center text-lg">
          {hostilesData?.hostiles && (
            <div
              className="mb-4 rounded-lg bg-danger-100 px-6 py-5 text-base text-black md:min-w-[470px]"
              role="alert"
            >
              {/* Split the hostiles string into an array of lines */}
              {hostilesData.hostiles &&
                hostilesData.hostiles.split("\n").map((line, index) => (
                  <div className="text-left" key={index}>
                    {line}
                  </div>
                ))}
            </div>
          )}

          {/* Show LoadingSpinner if defenders is empty or whitespace */}
          {hostilesData?.hostiles !== "" && !hostilesData?.hostiles ? (
            <LoadingSpinner />
          ) : null}

          {friendliesData?.defenders && (
            <div
              className="mb-4 rounded-lg bg-success-100 px-6 py-5 text-base text-black md:min-w-[470px]"
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

          {/* Show LoadingSpinner if defenders is empty or whitespace */}
          {friendliesData?.defenders !== "" && !friendliesData?.defenders ? (
            <LoadingSpinner />
          ) : null}

          {paMail?.email?.length && paMail?.email?.length > 0 ? (
            <div
              className="mb-4 min-w-[434px] rounded-lg bg-secondary-100 px-6 py-5 text-base text-secondary-800 md:min-w-[470px]"
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

import { api } from "@/utils/api";
import LoadingSpinner from "../Loader/LoadingSpinner";
import Link from "next/link";

const Information = () => {
  const { data: hostilesData } = api.paUsers.getHostiles.useQuery({
    Userid: 1,
  });

  const { data: friendliesData } = api.paUsers.getFriendlies.useQuery({
    Userid: 1,
  });

  const { data: paMail } = api.paMail.getUnseenMailByUserId.useQuery({
    Userid: 1,
  });

  return (
    <>
      <div className="mt-4 flex w-full flex-col items-center justify-center gap-12 px-4 py-4 text-white">
        <div className="flex flex-col items-center gap-2 text-center text-lg">
          {hostilesData?.hostiles ? (
            <div
              className="mb-4 rounded-lg bg-danger-100 px-6 py-5 text-base text-black"
              role="alert"
            >
              {hostilesData.hostiles}
            </div>
          ) : (
            <LoadingSpinner />
          )}

          {friendliesData?.defenders ? (
            <div
              className="mb-4 rounded-lg bg-success-100 px-6 py-5 text-base text-black"
              role="alert"
            >
              {friendliesData.defenders}
            </div>
          ) : (
            <LoadingSpinner />
          )}

          {paMail?.email?.length && paMail?.email?.length > 0 ? (
            <div
              className="mb-4 min-w-[434px] rounded-lg bg-secondary-100 px-6 py-5 text-base text-secondary-800"
              role="alert"
            >
              <Link href="/mail" className="font-bold text-info-800">
                You have unread email
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Information;

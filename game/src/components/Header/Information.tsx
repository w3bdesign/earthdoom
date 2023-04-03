import { api } from "@/utils/api";
import LoadingSpinner from "../Loader/LoadingSpinner";

const Information = () => {
  const { data: hostilesData } = api.paUsers.getHostiles.useQuery({
    Userid: 1,
  });
  return (
    <>
      <div className="mt-4 flex w-full flex-col items-center justify-center gap-12 px-4 py-4 text-white">
        <div className="flex flex-col items-center gap-2 text-center text-lg">
          {hostilesData?.hostiles ? (
            <div
              className="mb-4 rounded-lg bg-danger-100 px-6 py-5 text-base text-danger-700"
              role="alert"
            >
              {hostilesData.hostiles}
            </div>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </>
  );
};

export default Information;

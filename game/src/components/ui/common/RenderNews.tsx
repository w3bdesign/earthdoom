import LoadingSpinner from "../Loader/LoadingSpinner";

interface INewsProps {
  isLoading: boolean;
  hostiles?: string;
  friendlies?: string;
}

const HostileNews = ({ content }: { content: string }) => {
  return (
    <h2 className="px-6 py-4 text-center text-xl font-bold text-red-500">
      {content}
    </h2>
  );
};

const FriendlyNews = ({ content }: { content: string }) => {
  return (
    <h2 className="px-6 py-4 text-center text-xl font-bold text-green-500">
      {content}
    </h2>
  );
};

const NewsRender = ({ isLoading, hostiles, friendlies }: INewsProps) => {
  const hasNews = hostiles || friendlies;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (hasNews) {
    return (
      <div className="mt-8 flex min-w-[520px] flex-col bg-white text-black">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              {hostiles && <HostileNews content={hostiles} />}
              {friendlies && <FriendlyNews content={friendlies} />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex min-w-[520px] flex-col bg-white text-black">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center overflow-hidden">
            <h1 className="text-bold p-4 text-center text-2xl text-black">
              No data
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsRender;

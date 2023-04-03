import { type NextPage } from "next";

import { api } from "@/utils/api";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";
import Layout from "@/components/Layout/Layout";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const secret = api.paUsers.getSecretMessage.useQuery();

  const { data } = api.example.paUser.useQuery();

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 text-white">
          <h1 className="text-5xl font-extrabold tracking-tight text-center sm:text-[5rem]">
            Earth Doom
          </h1>
          <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2 md:gap-8">
            <h3 className="text-2xl font-bold">Name:</h3>
            {data?.map((user) => (
              <div className="text-lg" key={user.id}>
                {user.name}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-2 bg-neutral-900">
            <p className="p-4 text-2xl text-center">
              {hello.data ? hello.data.greeting : <LoadingSpinner />}
            </p>
            <p className="p-4 text-2xl text-center">
              {secret.data ? secret.data : <LoadingSpinner />}
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;

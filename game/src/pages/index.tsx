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
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Earth Doom
          </h1>
          <div className="grid grid-cols-1 gap-4 text-white sm:grid-cols-2 md:gap-8">
            <h3 className="text-2xl font-bold">Name:</h3>
            {data?.map((user) => (
              <div className="text-lg" key={user.id}>
                {user.name}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-2 bg-neutral-900">
            <p className="p-4 text-2xl text-white">
              {hello.data ? hello.data.greeting : <LoadingSpinner />}
            </p>
            <p className="p-4 text-2xl text-white">
              {secret.data ? secret.data : <LoadingSpinner />}
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;

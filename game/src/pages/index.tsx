import { type NextPage } from "next";
import Head from "next/head";

import { api } from "@/utils/api";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const secret = api.paUsers.getSecretMessage.useQuery();

  const { data } = api.example.paUser.useQuery();

  console.log(data);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen items-center justify-center bg-neutral-900">
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
            <p className="text-2xl text-white p-4">
              {hello.data ? hello.data.greeting : <LoadingSpinner />}
            </p>
            <p className="text-2xl text-white p-4">
              {secret.data ? secret.data : <LoadingSpinner />}
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

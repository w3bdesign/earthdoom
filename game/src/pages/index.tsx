import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 text-white">
          <h1 className="text-center text-3xl font-extrabold tracking-tight sm:text-[3rem]">
            Earth Doom
          </h1>
        </div>
      </Layout>
    </>
  );
};

export default Home;

import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";

// import { api } from "@/utils/api";

const AddUser: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 text-white">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
            <h1 className="text-center text-2xl">Main</h1>
            <div className="relative sm:mx-auto">
              Here we are going to add the user to the database
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AddUser;

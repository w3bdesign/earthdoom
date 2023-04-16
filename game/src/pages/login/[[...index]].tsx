import { SignIn } from "@clerk/nextjs";

import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";

const Login: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <SignIn path="/login" routing="path" />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;

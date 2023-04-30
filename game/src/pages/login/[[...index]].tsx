import { SignIn, SignedOut } from "@clerk/nextjs";

import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";

const Login: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center px-2 py-2 ">
          <SignedOut>
            <div className="mt-6 flex h-[55vh] items-center justify-center">
              <SignIn path="/login" routing="path" afterSignInUrl="/" />
            </div>
          </SignedOut>
        </div>
      </Layout>
    </>
  );
};

export default Login;

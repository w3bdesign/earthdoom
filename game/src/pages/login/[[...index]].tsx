import { SignIn, SignedOut } from "@clerk/nextjs";

import { type NextPage } from "next";

import { Layout } from "@/components/common/Layout";

const Login: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center mb-6">
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

import { SignIn, useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";

const Login: NextPage = () => {
  const { isLoaded } = useUser();

  return (
    <>
      <Layout>
      <div className="container flex flex-col items-center justify-center px-2 py-2 ">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            {!isLoaded ? (
              <div className="flex min-h-[150px] items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <SignIn path="/login" routing="path" afterSignInUrl="/" />
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;

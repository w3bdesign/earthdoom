import { SignIn, useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";

const Login: NextPage = () => {
  const { isLoaded } = useUser();

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            {!isLoaded ? (
              <div className="flex min-h-[150px] items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <SignIn path="/login" routing="path" />
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;

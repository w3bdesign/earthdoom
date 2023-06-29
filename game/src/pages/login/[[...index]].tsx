import { SignIn, SignedOut } from "@clerk/nextjs";

import type { NextPage } from "next";

import { Layout } from "@/components/common/Layout";

/**
 * Renders the Login component with a sign-in form
 *
 * @return {JSX.Element} The Login component
 */
const Login: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
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

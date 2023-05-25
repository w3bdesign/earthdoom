import { type NextPage } from "next";

import { UserButton, SignUp, SignedIn, SignedOut } from "@clerk/nextjs";

import { Layout } from "@/components/common/Layout";

/**
 * Renders the Register component that displays a form for users to sign up.
 *
 * @return {JSX.Element} The JSX element representing the Register component.
 */
const Register: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <SignedOut>
              <div className="mt-6 flex h-[55vh] items-center justify-center">
                <SignUp
                  path="/register"
                  routing="path"
                  afterSignUpUrl="/addUser"
                />
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Register;

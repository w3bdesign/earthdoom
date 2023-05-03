import { type NextPage } from "next";

import { SignOutButton, SignUp, SignedIn, SignedOut } from "@clerk/nextjs";

import { Layout } from "@/components/common/Layout";

const Register: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center mb-6">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <p className="text-2xl text-white">
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
                <SignOutButton />
              </SignedIn>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Register;

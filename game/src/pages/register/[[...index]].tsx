import { type NextPage } from "next";

import { SignUp, SignedIn, SignedOut } from "@clerk/nextjs";

import SignOutButton from "@/components/Auth/SignOut";
import Layout from "@/components/Layout/Layout";

const Register: NextPage = () => {
  return (
    <>
      <Layout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 ">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <p className="text-2xl text-white">
              <SignedOut>
                <SignUp
                  path="/register"
                  routing="path"
                  afterSignUpUrl="/addUser"
                />
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

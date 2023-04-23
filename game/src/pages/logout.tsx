import {
  SignOutButton,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";

const Logout: NextPage = () => {
  return (
    <>
      <Layout>
      <div className="container flex flex-col items-center justify-center px-2 py-2 ">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <p className="text-2xl text-white">
              <SignedIn>
                <SignOutButton>
                  <button
                    type="button"
                    className="inline-block rounded bg-primary p-8 pb-2 pt-2.5 text-xl font-medium leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600"
                  >
                    Sign out
                  </button>
                </SignOutButton>
              </SignedIn>
              <SignedOut>
                <SignInButton redirectUrl="/">
                  <button
                    type="button"
                    className="inline-block rounded bg-primary p-8 pb-2 pt-2.5 text-xl font-medium leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600"
                  >
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Logout;

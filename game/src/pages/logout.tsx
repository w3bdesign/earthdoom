import { SignUpButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

import { type NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import { Button } from "@/components/ui";

/**
 * Renders a logout button that either signs out the user or redirects them to the sign in page depending on their authentication status.
 *
 * @return {JSX.Element} The JSX element containing the logout button
 */
const Logout: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <p className="mt-12 text-2xl text-white">
              <SignedIn>
                <SignUpButton>
                  <Button
                    type="button"
                    className="inline-block rounded bg-primary p-8 pb-2 pt-2.5 text-xl font-medium leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600"
                  >
                    Sign out
                  </Button>
                </SignUpButton>
              </SignedIn>
              <SignedOut>
                <SignInButton redirectUrl="/">
                  <Button
                    type="button"
                    className="inline-block rounded bg-primary p-8 pb-2 pt-2.5 text-xl font-medium leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600"
                  >
                    Sign in
                  </Button>
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

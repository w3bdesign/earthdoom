import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

import { useClerk } from "@clerk/nextjs";

import type { NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import { Button } from "@/components/ui";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";

/**
 * Renders a logout button that either signs out the user or redirects them to the sign in page depending on their authentication status.
 *
 * @return {JSX.Element} The JSX element containing the logout button
 */
const Logout: NextPage = () => {
  const { signOut } = useClerk();
  return (
    <>
      <Layout>
        <PageHeader title="Log out" />
        <Panel>
          <SignedIn>
            <p className="mb-4 text-sm text-muted">
              Your empire keeps running while you are away.
            </p>
            <Button variant="secondary" onClick={() => signOut()}>
              Log out
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button>Sign in</Button>
            </SignInButton>
          </SignedOut>
        </Panel>
      </Layout>
    </>
  );
};

export default Logout;

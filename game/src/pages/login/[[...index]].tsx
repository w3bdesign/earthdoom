import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

import { Layout } from "@/components/common/Layout";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

import { api } from "@/utils/api";

import type { NextPage } from "next";

const LoadingLayout = () => (
  <Layout>
    <div className="container mb-6 flex flex-col items-center justify-center">
      <div className="mt-12">
        <LoadingSpinner />
      </div>
    </div>
  </Layout>
);

const getRedirectDestination = (hasExistingPlayer: boolean): string =>
  hasExistingPlayer ? "/" : "/addUser";

const usePlayerQuery = (username: string | null | undefined) =>
  api.paUsers.getPlayerByNick.useQuery(
    { nick: username || "" },
    { enabled: !!username },
  );

/**
 * Renders the Login page.
 * Redirects authenticated users to the home page or addUser page.
 *
 * @return {JSX.Element} The Login page component.
 */
// fallow-ignore-next-line complexity
const Login: NextPage = () => {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { data: paPlayer, isLoading: isPlayerLoading } = usePlayerQuery(
    user?.username,
  );

  const isReady = isUserLoaded && !isPlayerLoading;
  const hasExistingPlayer = !!paPlayer?.id;

  useEffect(() => {
    if (!isReady || !user) return;
    void router.push(getRedirectDestination(hasExistingPlayer));
  }, [user, isReady, hasExistingPlayer, router]);

  return <LoadingLayout />;
};

export default Login;

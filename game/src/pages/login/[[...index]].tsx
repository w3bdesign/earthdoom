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

/**
 * Renders the Login page.
 * Redirects authenticated users to the home page or addUser page.
 *
 * @return {JSX.Element} The Login page component.
 */
const Login: NextPage = () => {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();

  const { data: paPlayer, isLoading: isPlayerLoading } =
    api.paUsers.getPlayerByNick.useQuery(
      { nick: user?.username || "" },
      { enabled: !!user?.username },
    );

  const isReady = isUserLoaded && !isPlayerLoading;
  const hasExistingPlayer = !!(paPlayer && paPlayer.id);

  useEffect(() => {
    if (!isReady || !user) return;

    const destination = hasExistingPlayer ? "/" : "/addUser";
    void router.push(destination);
  }, [user, isReady, hasExistingPlayer, router]);

  return <LoadingLayout />;
};

export default Login;

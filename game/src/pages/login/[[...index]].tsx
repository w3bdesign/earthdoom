import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

import { Layout } from "@/components/common/Layout";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

import { api } from "@/utils/api";

import type { NextPage } from "next";

/**
 * Renders the Login page.
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

  const addPlayer = useCallback(() => {
    return router.push("/addUser");
  }, [router]);

  const redirect = useCallback(() => {
    return router.push("/");
  }, [router]);

  // 
  // TODO: Cleanup this code
  // 
  useEffect(() => {
    if (isUserLoaded && !isPlayerLoading) {
      if (user) {
        if (paPlayer && paPlayer.id) {
          void redirect();
        } else {
          void addPlayer();
        }
      }
    }
  }, [user, isUserLoaded, paPlayer, isPlayerLoading, redirect, addPlayer]);

  if (!isUserLoaded || isPlayerLoading) {
    return (
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="mt-12">
            <LoadingSpinner />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mb-6 flex flex-col items-center justify-center">
        <div className="mt-12">
          <LoadingSpinner />
        </div>
      </div>
    </Layout>
  );
};

export default Login;

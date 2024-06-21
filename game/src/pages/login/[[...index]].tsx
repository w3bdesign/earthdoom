import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { Layout } from "@/components/common/Layout";
import { useUser } from "@clerk/nextjs";
import { api } from "@/utils/api";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

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

  useEffect(() => {
    if (isUserLoaded && !isPlayerLoading) {
      if (user) {
        if (paPlayer && paPlayer.id) {
          void redirect();
        } else {
          void addPlayer();
        }
      } else {
        // User is not logged in, redirect to login page or show login form
        // For example: router.push("/login");
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

  // This part will only be reached if there's an unexpected state
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

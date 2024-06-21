import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import type { NextPage } from "next";
import { Layout } from "@/components/common/Layout";
import { useUser } from "@clerk/nextjs";
import { api } from "@/utils/api";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

const Login: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const { data: paPlayer, isLoading } = api.paUsers.getPlayerByNick.useQuery({
    nick: user?.username || "",
  });

  const addPlayer = useCallback(() => {
    return router.push("/addUser");
  }, [router]);

  const redirect = useCallback(() => {
    return router.push("/");
  }, [router]);

  useEffect(() => {
    if (!isLoading) {
      if (paPlayer && paPlayer.id) {
        void redirect();
      } else {
        void addPlayer();
      }
    }
  }, [paPlayer, isLoading, redirect, addPlayer]);

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

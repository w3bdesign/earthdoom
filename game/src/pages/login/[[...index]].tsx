import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import type { NextPage } from "next";
import { Layout } from "@/components/common/Layout";
import { useUser } from "@clerk/nextjs";
import { api } from "@/utils/api";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

/**
 * Renders the Login component with a sign-in form
 *
 * @return {JSX.Element} The Login component
 */
const Login: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user?.username || "",
  });

  // wrapped in `useCallback` to avoid re-creating the function on each render
  const addPlayer = useCallback(async () => {
    return router.push("/addUser");
  }, [router]);

  const redirect = useCallback(async () => {
    return router.push("/");
  }, [router]);

  useEffect(() => {
    if (paPlayer && paPlayer.id) {
      void addPlayer();
    } else {
      void redirect();
    }
  }, [paPlayer]);

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    </>
  );
};

export default Login;

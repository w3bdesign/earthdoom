//import { SignIn, SignedOut } from "@clerk/nextjs";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import type { NextPage } from "next";
import { Layout } from "@/components/common/Layout";

/**
 * Renders the Login component with a sign-in form
 *
 * @return {JSX.Element} The Login component
 */
const Login: NextPage = () => {
  const router = useRouter();

  // wrapped in `useCallback` to avoid re-creating the function on each render
  const redirect = useCallback(async () => {
    return router.push("/addUser");
  }, [router]);

  useEffect(() => {
    alert("Login test");
    void redirect();
  }, [router]);

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          Login redirect
        </div>
      </Layout>
    </>
  );
};

export default Login;

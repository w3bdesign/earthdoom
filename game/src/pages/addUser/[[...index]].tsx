import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";

import { api } from "@/utils/api";
import { useEffect } from "react";

const AddUser: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();

  const { mutate } = api.paUsers.createPlayer.useMutation({
    onSuccess() {
      router.push("/");
    },
    onError() {
      router.push("/error");
    },
  });

  //if (!user) return null;

  useEffect(() => {
    if (user) {
      mutate({ nick: user!.username! });
    } else {
      alert("No user");
    }
  }, [user?.username]);

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 text-white">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
            <h1 className="text-center text-2xl">Create player</h1>
            <p className="text-center text-sm">User: {user?.username}</p>
            <div className="relative sm:mx-auto">Creating player ...</div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AddUser;

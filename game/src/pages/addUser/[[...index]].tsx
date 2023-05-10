import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

import type { NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import { ToastComponent } from "@/components/ui/common";

import { api } from "@/utils/api";

const AddUser: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();

  const { mutate } = api.paUsers.createPlayer.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "Player created", type: "success" });
      await router.push("/");
    },
  });

  useEffect(() => {
    if (user && user.username) {
      mutate({ nick: user.username });
    }
  }, [mutate, user]);

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center text-white">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
            <h1 className="text-center text-2xl">Create player</h1>
            <div className="relative py-4 sm:mx-auto">Creating player ...</div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AddUser;

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

import type { NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import { ToastComponent } from "@/components/ui";

import { api } from "@/utils/api";

/**
 * Renders a page for creating a player and creates a new player for the logged in user.
 *
 * @return {JSX.Element} The page component for creating a player.
 */
const AddUser: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();

  const { mutate } = api.paUsers.createPlayer.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "Player created", type: "success" });
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
      await router.push("/");
    },
  });

  useEffect(() => {
    const createPlayer = async () => {
      if (user && user.id && user.username) {
        const { data: existingPlayer } = api.paUsers.getPlayerByNick.useQuery(
          { nick: user?.username || "" },
          { enabled: !!user?.username },
        );

        if (!existingPlayer) {
          mutate({ nick: user?.username });
        } else {
          await router.push("/");
        }
      }
    };

    createPlayer().then(() => {
      console.log("done");
    });
  }, [mutate, user, router]);

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

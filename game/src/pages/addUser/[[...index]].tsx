import { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

import { Layout } from "@/components/common/Layout";
import { ToastComponent } from "@/components/ui";

import { api } from "@/utils/api";

import type { NextPage } from "next";

const REDIRECT_DELAY_MS = 2000;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const showError = (message: string) => {
  ToastComponent({ message, type: "error" });
};

const useCreatePlayerMutation = () => {
  const router = useRouter();

  return api.paUsers.createPlayer.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "Player created", type: "success" });
      await delay(REDIRECT_DELAY_MS);
      await router.push("/");
    },
    onError: (error) => {
      console.error("Error creating player:", error);
      showError("Error creating player");
    },
  });
};

const isUserReady = (
  user: { id?: string; username?: string | null } | null | undefined,
): user is { id: string; username: string } => !!(user?.id && user?.username);

const getStatusMessage = (isLoading: boolean): string =>
  isLoading ? "Checking existing player..." : "Creating player...";

/**
 * Renders a page for creating a player and creates a new player for the logged in user.
 *
 * @return {JSX.Element} The page component for creating a player.
 */
const AddUser: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { mutate } = useCreatePlayerMutation();

  const { data: existingPlayer, isLoading } =
    api.paUsers.getPlayerByNick.useQuery(
      { nick: user?.username || "" },
      { enabled: !!user?.username },
    );

  const createPlayer = useCallback(async () => {
    if (!isUserReady(user)) return;
    if (existingPlayer) {
      await router.push("/");
      return;
    }
    if (!isLoading) {
      mutate({ nick: user.username });
    }
  }, [user, existingPlayer, isLoading, mutate, router]);

  useEffect(() => {
    createPlayer().catch((error) => {
      console.error("Error in createPlayer:", error);
      showError("Error creating player");
    });
  }, [createPlayer]);

  return (
    <Layout>
      <div className="container mb-6 flex flex-col items-center justify-center text-white">
        <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
          <h1 className="text-center text-2xl">Create player</h1>
          <div className="relative py-4 sm:mx-auto">
            {getStatusMessage(isLoading)}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddUser;

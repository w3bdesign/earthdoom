import { useUser } from "@clerk/nextjs";
import { api } from "@/utils/api";

/**
 * Custom hook that fetches the current player's data.
 * Encapsulates auth check + player query logic used across all pages.
 *
 * @returns Object with player data, auth state, and loading state
 */
export const usePlayerData = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery(
    { nick: user?.username ?? "" },
    { enabled: !!isSignedIn && !!user?.username },
  );

  const isAuthenticated = !!isSignedIn && !!user?.username;

  return {
    paPlayer,
    user,
    isSignedIn,
    isLoaded,
    isAuthenticated,
  };
};

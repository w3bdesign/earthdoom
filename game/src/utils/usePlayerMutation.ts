import { api } from "@/utils/api";
import { ToastComponent } from "@/components/ui";

interface UsePlayerMutationOptions {
  successMessage: string;
  errorMessage?: string;
  onSuccessCallback?: (data: unknown) => void;
}

/**
 * Custom hook that wraps a mutation with common toast notification
 * and cache invalidation logic used across construct/research/energy/spying pages.
 *
 * @param mutationFn - The tRPC mutation hook to use
 * @param options - Configuration for messages and callbacks
 * @returns The mutation object with mutate and isLoading
 */
export const usePlayerMutation = <TMutation extends { useMutation: (opts: unknown) => unknown }>(
  mutationFn: TMutation,
  options: UsePlayerMutationOptions
) => {
  const ctx = api.useContext();

  const { successMessage, errorMessage = "Database error", onSuccessCallback } = options;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutation = (mutationFn as any).useMutation({
    onSuccess: async (data: unknown) => {
      ToastComponent({ message: successMessage, type: "success" });
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
      await ctx.paUsers.getPlayerByNick.invalidate();
      await ctx.paUsers.getPlayerByNick.refetch();
    },
    onError: () => {
      ToastComponent({ message: errorMessage, type: "error" });
    },
  });

  return mutation as { mutate: typeof mutation.mutate; isLoading: boolean };
};

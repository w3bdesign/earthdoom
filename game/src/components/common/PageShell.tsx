import type { FC, ReactNode } from "react";
import type { PaPlayer } from "@/types/player";

import { Layout } from "@/components/common/Layout";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

interface PageShellProps {
  isAuthenticated: boolean;
  paPlayer: PaPlayer | null | undefined;
  children: ReactNode;
  /** If true, renders LoadingSpinner instead of null when not authenticated */
  showSpinnerOnUnauthenticated?: boolean;
}

/**
 * Common page shell that handles authentication + loading guard pattern.
 * Reduces cyclomatic complexity in page components by extracting
 * the repetitive auth/loading checks.
 *
 * @param props - PageShell configuration
 * @returns The rendered shell with loading states or children
 */
const PageShell: FC<PageShellProps> = ({
  isAuthenticated,
  paPlayer,
  children,
  showSpinnerOnUnauthenticated = false,
}) => {
  if (!isAuthenticated) {
    return showSpinnerOnUnauthenticated ? <LoadingSpinner /> : null;
  }

  if (!paPlayer) {
    return (
      <Layout>
        <div className="mt-12">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout paPlayer={paPlayer}>
      {children}
    </Layout>
  );
};

export default PageShell;

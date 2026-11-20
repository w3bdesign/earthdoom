import Link from "next/link";

import type { NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import { Alert, PageHeader } from "@/components/ui";

/**
 * Renders the error page with a heading.
 *
 * @return {NextPage} The Next.js page component.
 */
const Error: NextPage = () => {
  return (
    <Layout>
      <PageHeader title="Error page" />
      <Alert
        tone="hostile"
        title="Something went wrong"
        action={
          <Link
            href="/"
            className="text-sm font-semibold text-accent hover:text-accent-strong"
          >
            Back to Overview
          </Link>
        }
      >
        The page couldn&apos;t be loaded. Try again in a moment.
      </Alert>
    </Layout>
  );
};

export default Error;

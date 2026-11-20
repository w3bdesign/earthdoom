import type { NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import { PageHeader, Panel } from "@/components/ui";

const Senate: NextPage = () => {
  // TODO - Implement this functionality
  return (
    <Layout>
      <PageHeader
        title="Senate"
        description="Vote on proposals that affect every player in the senate."
      />
      <Panel>
        <p className="text-sm text-muted">
          The senate isn't available yet. Check back after a future update.
        </p>
      </Panel>
    </Layout>
  );
};

export default Senate;

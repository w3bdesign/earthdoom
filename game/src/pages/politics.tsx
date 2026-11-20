import type { NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import { PageHeader, Panel } from "@/components/ui";

const Politics: NextPage = () => {
  // TODO - Implement this functionality
  return (
    <Layout>
      <PageHeader
        title="Politics"
        description="Shape your continent's policies together with your neighbours."
      />
      <Panel>
        <p className="text-sm text-muted">
          Politics isn't available yet. Check back after a future update.
        </p>
      </Panel>
    </Layout>
  );
};

export default Politics;

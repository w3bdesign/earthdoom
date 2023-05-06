import { useEffect } from "react";

import { type NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";

import MailTable from "@/components/features/Mail/MailTable";
import { ToastComponent } from "@/components/ui/common";

const Mail: NextPage = () => {
  const { mutate: markAsSeen } = api.paMail.markAsSeen.useMutation({
    onError: () => {
      ToastComponent({ message: "Database error", type: "error" });
    },
  });

  useEffect(() => {
    // TODO: Replace with actual user id
    markAsSeen({ sentTo: 12 });
  }, [markAsSeen]);

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <h2 className="py-4 text-center text-2xl font-bold text-white">
              Mail
            </h2>
            <div className="mt-2 flex flex-col bg-white text-black">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <MailTable />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Mail;

import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import { type NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";

import MailTable from "@/components/features/Mail/MailTable";
import { ToastComponent } from "@/components/ui/common";

const Mail: NextPage = () => {
  const { mutate: markAsSeen } = api.paMail.markAsSeen.useMutation({
    onSuccess: () => {
      ToastComponent({ message: "Marked all email as seen", type: "success" });
    },
    onError: () => {
      console.error("Failure marking as seen");
    },
  });

  useEffect(() => {
    markAsSeen({ sentTo: 12 });
  }, [markAsSeen]);

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <div className="mt-8 flex flex-col bg-white text-black">
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

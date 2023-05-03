import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import { type NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import { Button } from "@/components/ui/common";

const Mail: NextPage = () => {
  const ctx = api.useContext();

  const deleteEmailToast = () => toast("Email deleted");

  const { mutate: markAsSeen } = api.paMail.markAsSeen.useMutation({
    onError: () => {
      console.error("Failure marking as seen");
    },
  });

  const { data: paMail } = api.paMail.getAllMailByUserId.useQuery({
    Userid: 1,
  });

  const { mutate } = api.paMail.deleteEmail.useMutation({
    onSuccess: async () => {
      deleteEmailToast();
      await ctx.paMail.getAllMailByUserId.invalidate({ Userid: 1 });
    },
    onError: () => {
      console.error("Failure deleting!");
    },
  });

  const handleDelete = (id: number) => {
    mutate({ id });
  };

  useEffect(() => {
    markAsSeen({ sentTo: 1 });
  }, [markAsSeen]);

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <div className="mt-8 flex flex-col bg-white text-black">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    {paMail?.email?.length && paMail?.email?.length > 0 && (
                      <table className="min-w-full text-left text-sm font-light">
                        <thead className="border-b font-medium dark:border-neutral-500">
                          <tr>
                            <th scope="col" className="px-6 py-4">
                              ID
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Title
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Content
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Delete
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paMail?.email?.map((mail) => (
                            <tr
                              key={mail.id}
                              className="border-b dark:border-neutral-500"
                            >
                              <td className="whitespace-nowrap px-6 py-4 font-medium">
                                {mail.id}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {mail.header}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {mail.news}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <Button
                                  type="button"
                                  className="inline-block rounded bg-danger px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#dc4c64] transition duration-150 ease-in-out hover:bg-danger-600 hover:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:bg-danger-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-danger-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)]"
                                  onClick={() => handleDelete(mail.id)}
                                >
                                  Delete
                                </Button>
                                <Toaster />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
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

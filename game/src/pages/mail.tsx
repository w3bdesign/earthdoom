import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import type { NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import MailTable from "@/components/features/Mail/MailTable";
import { ToastComponent } from "@/components/ui";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

/**
 * Renders the Mail component and fetches the user's mail data from the server.
 * If the user is not signed in or does not have a username, displays a loading spinner.
 * If there is a database error while marking a mail as seen, displays an error toast.
 *
 * @return {JSX.Element} The JSX element for the Mail component.
 */
const Mail: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return <LoadingSpinner />;

  const { data: paMail } = api.paMail.getAllMailByNick.useQuery({
    nick: user.username,
  });

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  const { mutate: markAsSeen } = api.paMail.markAsSeen.useMutation({
    onError: () => {
      ToastComponent({ message: "Database error", type: "error" });
    },
  });

  /*useEffect(() => {
    markAsSeen({ sentTo: paPlayer.id });
  }, [markAsSeen]);*/

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
                    {paMail && <MailTable mail={paMail.mail} />}
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

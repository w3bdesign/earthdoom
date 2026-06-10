import { useRouter } from "next/router";
import type { NextPage } from "next";

import { api } from "@/utils/api";
import { usePlayerData } from "@/utils/usePlayerData";
import { Layout } from "@/components/common/Layout";
import MailTable from "@/components/features/Mail/MailTable";
import { Button, ToastComponent } from "@/components/ui";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";
import NewMail from "@/components/features/Mail/NewMail";

/**
 * Renders the Mail component and fetches the user's mail data from the server.
 *
 * @return {JSX.Element} The JSX element for the Mail component.
 */
const Mail: NextPage = () => {
  const ctx = api.useContext();
  const router = useRouter();
  const recipientNick = router.query.nick as string | undefined;

  const { paPlayer, isAuthenticated, user } = usePlayerData();

  const { data: paMail } = api.paMail.getAllMailByNick.useQuery(
    { nick: user?.username ?? "" },
    { enabled: isAuthenticated },
  );

  const { mutate: markAsSeen } = api.paMail.markAsSeen.useMutation({
    onSuccess: async () => {
      await ctx.paMail.getAllMailByNick.invalidate();
      await ctx.paMail.getAllMailByNick.refetch();
      ToastComponent({ message: "Mail marked as seen", type: "success" });
    },
    onError: () => {
      ToastComponent({ message: "Database error", type: "error" });
    },
  });

  if (!isAuthenticated) {
    return null;
  }

  if (!paMail || !paPlayer) {
    return (
      <Layout>
        <div className="mt-12">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  const hasUnseenEmail = paMail.mail.some((mail) => mail.seen === 0);

  return (
    <Layout paPlayer={paPlayer}>
      <div className="container mb-6 flex flex-col items-center justify-center">
        <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
          <h2 className="mt-4 py-4 text-center text-2xl font-bold text-white">
            Received Mail
          </h2>
          {hasUnseenEmail && (
            <MarkAllSeenButton
              onClick={() => markAsSeen({ sentTo: paPlayer.id })}
            />
          )}
          <MailTableSection mail={paMail.mail} />
          {recipientNick && (
            <NewMailSection paPlayer={paPlayer} recipientNick={recipientNick} />
          )}
        </div>
      </div>
    </Layout>
  );
};

/** Button to mark all mails as seen */
const MarkAllSeenButton = ({ onClick }: { onClick: () => void }) => (
  <div className="mt-6 flex justify-end py-4">
    <Button extraClasses="w-64" onClick={onClick}>
      Mark all as seen
    </Button>
  </div>
);

/** Mail table wrapper with overflow handling */
const MailTableSection = ({
  mail,
}: {
  mail: Parameters<typeof MailTable>[0]["mail"];
}) => (
  <div className="mt-2 flex flex-col bg-white text-black">
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full sm:px-6 lg:px-8">
        <div className="overflow-hidden">
          <MailTable mail={mail} />
        </div>
      </div>
    </div>
  </div>
);

/** New mail composition section */
const NewMailSection = ({
  paPlayer,
  recipientNick,
}: {
  paPlayer: Parameters<typeof NewMail>[0]["paPlayer"];
  recipientNick: string;
}) => (
  <div>
    <h2 className="mt-6 py-4 text-center text-2xl font-bold text-white">
      Send Mail to {recipientNick}
    </h2>
    <NewMail paPlayer={paPlayer} recipient={recipientNick} />
  </div>
);

export default Mail;

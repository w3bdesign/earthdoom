import { useRouter } from "next/router";
import type { NextPage } from "next";

import { api } from "@/utils/api";
import { usePlayerData } from "@/utils/usePlayerData";
import { Layout } from "@/components/common/Layout";
import MailTable from "@/components/features/Mail/MailTable";
import { Button, ToastComponent } from "@/components/ui";
import { PageSkeleton } from "@/components/ui/Skeleton";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";
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
        <PageSkeleton />
      </Layout>
    );
  }

  const hasUnseenEmail = paMail.mail.some((mail) => mail.seen === 0);

  return (
    <Layout paPlayer={paPlayer}>
      <PageHeader
        title="Mail"
        description="To write to a player, use Mail next to their name in the Ranking."
        actions={
          hasUnseenEmail && (
            <MarkAllSeenButton
              onClick={() => markAsSeen({ sentTo: paPlayer.id })}
            />
          )
        }
      />
      <div className="flex flex-col gap-4">
        {recipientNick && (
          <NewMailSection paPlayer={paPlayer} recipientNick={recipientNick} />
        )}
        <MailTableSection mail={paMail.mail} />
      </div>
    </Layout>
  );
};

/** Button to mark all mails as seen */
const MarkAllSeenButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant="secondary" onClick={onClick}>
    Mark all as seen
  </Button>
);

/** Mail table wrapper with overflow handling */
const MailTableSection = ({
  mail,
}: {
  mail: Parameters<typeof MailTable>[0]["mail"];
}) => (
  <Panel title="Inbox" meta={`${mail.length}`} flush>
    <MailTable mail={mail} />
  </Panel>
);

/** New mail composition section */
const NewMailSection = ({
  paPlayer,
  recipientNick,
}: {
  paPlayer: Parameters<typeof NewMail>[0]["paPlayer"];
  recipientNick: string;
}) => (
  <Panel title={`New mail to ${recipientNick}`}>
    <NewMail paPlayer={paPlayer} recipient={recipientNick} />
  </Panel>
);

export default Mail;

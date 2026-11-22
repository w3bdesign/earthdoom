import Head from "next/head";
import Link from "next/link";
import { SignedIn, useUser } from "@clerk/nextjs";

import type { ReactNode } from "react";
import type { PaPlayer } from "@/types/player";

import { api } from "@/utils/api";
import Information from "@/components/common/Header/Information";
import Sidebar from "@/components/common/Navigation/Sidebar";
import MobileNav from "@/components/common/Navigation/MobileNav";
import Footer from "./Footer";

interface ILayoutProps {
  paPlayer?: PaPlayer;
  children: ReactNode;
}

/** Number of unread mails, for the badge on the Mail link. */
const useUnreadMail = () => {
  const { user } = useUser();
  const nick = user?.username ?? "";
  const { data } = api.paMail.getUnseenMailByUserId.useQuery(
    { nick },
    { enabled: !!nick },
  );
  return data?.email?.length ?? 0;
};

/**
 * The app shell: navigation (sidebar on desktop, tab bar on phones), the resource bar
 * and alerts for the signed-in player, then the page content.
 *
 * @param {Object} ILayoutProps - The props object containing paPlayer and children.
 * @param {Object} ILayoutProps.paPlayer - The player object containing player information.
 * @param {ReactNode} ILayoutProps.children - The children components to be rendered.
 *
 * @return {JSX.Element} The JSX element containing the entire layout.
 */
const Layout = ({ paPlayer, children }: ILayoutProps) => {
  const unreadMail = useUnreadMail();

  return (
    <>
      <Head>
        <title>Earth Doom</title>
        <meta name="description" content="Earth Doom - www.earthdoom.com" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-accent px-3 py-2 font-semibold text-accent-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <div className="min-h-screen bg-ground text-ink">
        <Sidebar unreadMail={unreadMail} />
        <div className="flex min-h-screen flex-col md:pl-16 lg:pl-60">
          <header className="flex h-12 items-center justify-between border-b border-line bg-rail px-4 md:hidden">
            <Link
              href="/"
              className="text-sm font-bold tracking-[0.18em] uppercase font-stretch-125%"
            >
              Earth Doom
            </Link>
            {paPlayer && (
              <span className="text-sm text-muted">
                {paPlayer.tag && `[${paPlayer.tag}] `}
                {paPlayer.nick}
              </span>
            )}
          </header>
          <SignedIn>
            <Information paPlayer={paPlayer} />
          </SignedIn>
          <main
            id="main"
            tabIndex={-1}
            className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 focus:outline-hidden md:px-8 md:pt-8"
          >
            {children}
          </main>
          <Footer />
        </div>
        <MobileNav unreadMail={unreadMail} />
      </div>
    </>
  );
};

export default Layout;

import Head from "next/head";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

import { ReactNode } from "react";

import Navbar from "@/components/Header/Navbar";
import Footer from "./Footer";
import Information from "@/components/Header/Information";

interface ILayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  return (
    <>
      <Head>
        <title>Earth Doom - www.earthdoom.com</title>
        <meta name="description" content="Generated by Earth Doom" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SignedIn>
        <Navbar />
        <Information />
      </SignedIn>

      <main className="flex items-center justify-center">
        <SignedIn>{children}</SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </main>
      <Footer />
    </>
  );
};

export default Layout;

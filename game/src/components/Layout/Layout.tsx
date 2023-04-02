import Head from "next/head";

import Navbar from "@/components/Header/Navbar";
import Footer from "./Footer";
import { ReactNode } from "react";

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
      <Navbar />
      <main className="flex min-h-[82.8vh] items-center justify-center">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;

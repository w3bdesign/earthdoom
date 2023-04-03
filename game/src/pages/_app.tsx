import { type AppType } from "next/app";
import type { TwElements } from "tw-elements";

import { ClerkProvider } from "@clerk/nextjs";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { useEffect } from "react";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  useEffect(() => {
    const use = async () => {
      const tw: typeof TwElements = await import("tw-elements");
      // Now you can safely access the default property
      tw.default;
    };
    void use();
  }, []);

  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

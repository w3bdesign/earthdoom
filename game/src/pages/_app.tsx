import { type AppType } from "next/app";

import { ClerkProvider } from "@clerk/nextjs";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { useEffect } from "react";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  useEffect(() => {
    const use = async () => {
      (await import("tw-elements")).default;
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

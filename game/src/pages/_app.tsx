import Script from "next/script";

import { type AppType } from "next/app";

import { ClerkProvider } from "@clerk/nextjs";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
      <Script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/index.min.js"></Script>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

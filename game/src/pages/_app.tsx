import Script from "next/script";
import { Toaster } from "react-hot-toast";

import { ClerkProvider } from "@clerk/nextjs";

import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
      <Script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/tw-elements.umd.min.js"></Script>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

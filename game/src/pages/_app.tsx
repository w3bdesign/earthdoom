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
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

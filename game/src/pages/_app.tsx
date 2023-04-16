import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";

import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";

//  List pages you want to be publicly accessible, or leave empty if

//  every page requires authentication. Use this naming strategy:

//   "/"              for pages/index.js

//   "/foo"           for pages/foo/index.js

//   "/foo/bar"       for pages/foo/bar.js

//   "/foo/[...bar]"  for pages/foo/[...bar].js

const publicPages = [
  "/login/[[...index]]",
  "/register/[[...index]]",
  "/login",
  "/register",
];

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  const { pathname } = useRouter();

  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider {...pageProps}>
      <Toaster position="bottom-center" />    
      <Component {...pageProps} />
      <Script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/tw-elements.umd.min.js"></Script>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

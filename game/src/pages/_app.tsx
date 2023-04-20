import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { api } from "@/utils/api";

import { AppProps } from "next/app";
import { useRouter } from "next/router";

import "@/styles/globals.css";

//  List pages you want to be publicly accessible, or leave empty if
//  every page requires authentication. Use this naming strategy:
//   "/"              for pages/index.js
//   "/foo"           for pages/foo/index.js
//   "/foo/bar"       for pages/foo/bar.js
//   "/foo/[...bar]"  for pages/foo/[...bar].js
const publicPages = ["/login/[[...index]]", "/register/[[...index]]"];

function MyApp({ Component, pageProps }: AppProps) {
  // Get the pathname
  const { pathname } = useRouter();

  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname);

  // If the current route is listed as public, render it directly
  // Otherwise, use Clerk to require authentication
  return (
    <ClerkProvider {...pageProps}>
      {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <>
          <SignedIn>
            <Toaster position="bottom-center" />
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      )}
      <ReactQueryDevtools initialIsOpen={false} />
    </ClerkProvider>
  );
}

export default api.withTRPC(MyApp);

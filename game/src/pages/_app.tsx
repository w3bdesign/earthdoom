/*import { Toaster } from "react-hot-toast";

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

export default api.withTRPC(MyApp);*/

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";

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
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
}

export default api.withTRPC(MyApp);

//export default MyApp;

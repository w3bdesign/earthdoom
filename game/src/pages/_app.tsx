import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";

import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/router";
import { Archivo } from "next/font/google";

import type { AppProps } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";

import type { ToasterProps } from "react-hot-toast";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const TOAST_OPTIONS: ToasterProps["toastOptions"] = {
  className: "bg-raised! text-ink! border! border-line-strong! shadow-panel!",
  success: { iconTheme: { primary: "#5fd68f", secondary: "#05131d" } },
  error: { iconTheme: { primary: "#ef5f5f", secondary: "#05131d" } },
};

//  List pages you want to be publicly accessible, or leave empty if
//  every page requires authentication. Use this naming strategy:
//   "/"              for pages/index.js
//   "/foo"           for pages/foo/index.js
//   "/foo/bar"       for pages/foo/bar.js
//   "/foo/[...bar]"  for pages/foo/[...bar].js
const publicPages = ["/login/[[...index]]", "/register/[[...index]]"];

/**
 * Renders the app, either directly or using Clerk for authentication, based on the current route.
 *
 * @param {AppProps} props - the props object containing the Component and pageProps objects
 * @return {JSX.Element} the rendered app
 */
function MyApp({ Component, pageProps }: AppProps) {
  // Get the pathname
  const { pathname } = useRouter();

  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname);

  // If the current route is listed as public, render it directly
  // Otherwise, use Clerk to require authentication
  return (
    <ClerkProvider {...pageProps}>
      <div className={`${archivo.variable} font-sans`}>
        {isPublicPage ? (
          <Component {...pageProps} />
        ) : (
          <>
            <SignedIn>
              <Toaster position="top-center" toastOptions={TOAST_OPTIONS} />
              <Component {...pageProps} />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        )}
      </div>
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </ClerkProvider>
  );
}

export default api.withTRPC(MyApp);

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that can be accessed without authentication
const isPublicRoute = createRouteMatcher(["/anyone-can-visit-this-route"]);

// Define ignored routes that have no authentication information
const isIgnoredRoute = createRouteMatcher(["/no-auth-in-this-route"]);

export default clerkMiddleware(async (auth, request) => {
  // If the route is not public and not ignored, protect it
  if (!isPublicRoute(request) && !isIgnoredRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     */
    "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
    "/",
  ],
};

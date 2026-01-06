import { authMiddleware } from "@clerk/nextjs";

// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware
export default authMiddleware({
    // Allow signed out users to access the specified routes:
    publicRoutes: [
        '/sign-in',
        '/sign-up',
        '/api/webhooks(.*)',
        '/api/current-user',
    ],
    // Redirect unauthenticated users to sign-in
    signInUrl: '/sign-in',
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
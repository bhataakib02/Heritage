import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Custom middleware to redirect authenticated users from landing to home
export default authMiddleware({
    // Allow signed out users to access the specified routes:
    publicRoutes: [
        '/',
        '/landing',
        '/sign-in',
        '/sign-up',
        '/api/webhooks(.*)',
        '/api/current-user',
    ],
    // Redirect unauthenticated users to landing page
    signInUrl: '/sign-in',
    // After auth check, redirect authenticated users from landing to home
    afterAuth(auth, req) {
        const { pathname } = req.nextUrl;
        
        // If user is authenticated and trying to access landing page, redirect to home
        if (auth.userId && (pathname === '/' || pathname === '/landing')) {
            const homeUrl = req.nextUrl.clone();
            homeUrl.pathname = '/home';
            return NextResponse.redirect(homeUrl);
        }
        
        // Allow request to continue for all other cases
        return NextResponse.next();
    },
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
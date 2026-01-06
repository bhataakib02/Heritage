import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Create the base auth middleware
const clerkMiddleware = authMiddleware({
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
});

// Custom middleware to handle authenticated user redirect from landing page
export default function middleware(request: NextRequest) {
    // First, run the Clerk middleware
    const response = clerkMiddleware(request);
    
    // If user is authenticated and on landing page, redirect to /home
    const { pathname } = request.nextUrl;
    if (pathname === '/' && request.headers.get('x-clerk-auth-status') === 'signed-in') {
        const url = request.nextUrl.clone();
        url.pathname = '/home';
        return NextResponse.redirect(url);
    }
    
    return response;
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for FoodLink (HelpShare)
 * Handles server-side route protection using lightweight cookies.
 * Roles and Auth state are synced via cookies set in authStore.ts.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    const isAuthed = request.cookies.has("fl_auth");
    const role = request.cookies.get("fl_role")?.value;

    // 1. Admin Route Protection
    if (pathname.startsWith("/admin")) {
        if (!isAuthed) {
            const loginUrl = new URL("/auth/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
        
        // If logged in but not an admin, redirect to home
        if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // 2. Auth Route Protection (Redirect away from login if already authed)
    if (pathname.startsWith("/auth") && isAuthed) {
        // Allow complete-profile even if authed
        if (!pathname.startsWith("/auth/complete-profile")) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // 3. User Protected Routes (Profile, Settings, etc.)
    const isUserProtectedRoute = 
        pathname.startsWith("/profile") || 
        pathname.startsWith("/settings") || 
        pathname.startsWith("/notifications");

    if (isUserProtectedRoute && !isAuthed) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api (API routes)
         */
        "/((?!_next/static|_next/image|favicon.ico|api).*)",
    ],
};

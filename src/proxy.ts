import { NextRequest, NextResponse } from "next/server";

/**
 * Auth state lives in localStorage (Zustand persist), which is inaccessible
 * server-side. Route protection is handled client-side by the ProfileGuard
 * component. This proxy only does trivial pass-through.
 */
export function proxy(request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api).*)",
    ],
};

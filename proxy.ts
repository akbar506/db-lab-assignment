import { NextResponse } from "next/server";
import { authRoutes, protectedRoutes } from "./routes";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
    const { nextUrl } = request;
    const isLoggedIn = !!request.auth;
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isProtectedRoute = protectedRoutes.some((route) => {
        if (route === "/") {
            return nextUrl.pathname === route;
        }

        return (
            nextUrl.pathname === route ||
            nextUrl.pathname.startsWith(`${route}/`)
        );
    });

    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/", nextUrl));
        }
        return null;
    }

    if (!isLoggedIn && isProtectedRoute) {
        return NextResponse.redirect(new URL("/sign-in", nextUrl));
    }


    return null;
})

export const config = {
    matcher: ["/", "/surveys/:path*", "/sign-up", "/sign-in"], // Specify the routes the middleware applies to
};

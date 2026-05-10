import NextAuth from "next-auth"
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.name = user.name ?? token.name;
                token.email = user.email ?? token.email;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                if (token.name) {
                    session.user.name = String(token.name);
                }

                if (token.email) {
                    session.user.email = String(token.email);
                }
            }

            return session;
        }
    },
    ...authConfig
})
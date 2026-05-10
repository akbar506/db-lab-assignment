import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import { CredentialsSignin } from "next-auth"
import { db } from "./lib/db"

class CustomError extends CredentialsSignin {
    constructor(message: string) {
        super();
        this.code = message;
    }
}

export default {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                const email = String(credentials?.email ?? "").toLowerCase();
                const password = String(credentials?.password ?? "");

                if (!email || !password) {
                    throw new CustomError("Email and password are required");
                }

                const user = await db.user.findUnique({
                    where: { email },
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        password: true,
                    },
                })
                
                if (!user || !user.password) {
                    throw new CustomError("Invalid email or password");
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    throw new CustomError("Invalid email or password");
                }
                
                return {
                    id: user.id,
                    email: user.email,
                    name: user.username,
                };
            }
        })
    ]
} satisfies NextAuthConfig
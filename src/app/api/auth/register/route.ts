import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request: Request) {

    try {
        const { username, email, password } = await request.json();

        if (username.length < 3) {
            return NextResponse.json(
                { message: "Username must be at least 3 characters." },
                { status: 400 }
            );
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { message: "Invalid email address." },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters." },
                { status: 400 }
            );
        }

        const existingUser = await db.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
            select: { id: true },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Email or username already exists." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ message: "Account created." }, { status: 201 });
    }
    catch {
        return NextResponse.json(
            { message: "Invalid request body." },
            { status: 400 }
        );
    }
}

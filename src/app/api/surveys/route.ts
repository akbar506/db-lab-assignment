import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const normalizeOptionalString = (value?: string | null) => {
    if (!value) {
        return null;
    }

    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
};

const normalizeOptionalNumber = (value?: number | null) => {
    if (value === null || value === undefined) {
        return null;
    }

    return Number.isFinite(value) ? value : null;
};

enum surveys_gender {
  Male = "Male",
  Female = "Female"
}

export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    let payload: {
        full_name: string;
        age: number;
        gender: surveys_gender;
        email: string;
        preferred_programming_language?: string | null;
        programming_languages_known?: string | null;
        favorite_ide?: string | null;
        preferred_lab_time?: string | null;
        lab_infrastructure_rating?: number | null;
        satisfaction_level?: number | null;
        suggestions?: string | null;
        additional_feedback?: string | null;

    };

    try {
        payload = await request.json();

        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        try {
            await db.survey.create({
                data: {
                    user_id: user.id,
                    full_name: payload.full_name.trim(),
                    age: payload.age,
                    gender: payload.gender,
                    email: payload.email,
                    preferred_programming_language: normalizeOptionalString(
                        payload.preferred_programming_language
                    ),
                    programming_languages_known: normalizeOptionalString(
                        payload.programming_languages_known
                    ),
                    favorite_ide: normalizeOptionalString(payload.favorite_ide),
                    preferred_lab_time: normalizeOptionalString(payload.preferred_lab_time),
                    lab_infrastructure_rating: normalizeOptionalNumber(
                        payload.lab_infrastructure_rating
                    ),
                    satisfaction_level: normalizeOptionalNumber(payload.satisfaction_level),
                    suggestions: normalizeOptionalString(payload.suggestions),
                    additional_feedback: normalizeOptionalString(payload.additional_feedback),
                },
            });
        } catch {
            return NextResponse.json(
                { message: "Failed to submit survey." },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: "Survey submitted." }, { status: 201 });

    } catch {
        return NextResponse.json(
            { message: "Invalid request body." },
            { status: 400 }
        );
    }
}
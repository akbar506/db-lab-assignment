import z from "zod";

const optionalRating = z.number().int().min(1).max(5).optional();

export const surveySchema = z.object({
    full_name: z
        .string()
        .trim()
        .min(2, "Full name is required")
        .max(150, "Full name is too long"),
    age: z
        .number()
        .int()
        .min(10, "Age must be at least 10")
        .max(120, "Age must be 120 or less"),
    gender: z.enum(["Male", "Female"]),
    email: z.string().email("Invalid email address").toLowerCase(),
    preferred_programming_language: z
        .string()
        .trim()
        .max(100, "Preferred language is too long")
        .optional(),
    programming_languages_known: z
        .string()
        .trim()
        .max(500, "Languages list is too long")
        .optional(),
    favorite_ide: z
        .string()
        .trim()
        .max(100, "Favorite IDE is too long")
        .optional(),
    preferred_lab_time: z
        .string()
        .trim()
        .max(100, "Preferred lab time is too long")
        .optional(),
    lab_infrastructure_rating: optionalRating,
    satisfaction_level: optionalRating,
    suggestions: z.string().trim().max(1000, "Suggestions are too long").optional(),
    additional_feedback: z
        .string()
        .trim()
        .max(1000, "Feedback is too long")
        .optional(),
});

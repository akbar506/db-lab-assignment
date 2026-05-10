"use client";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { signUpSchema } from "@/schema/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ResponseState = {
    type: "success" | "error";
    message: string;
};

export default function SignUpPage() {
    const [response, setResponse] = useState<ResponseState | null>(null);
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setResponse(null);
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password: data.password,
            }),
        });

        if (!res.ok) {
            const payload = await res.json().catch(() => ({}));
            setResponse({
                type: "error",
                message: payload?.message || "Sign up failed. Try again.",
            });
            return;
        }

        setResponse({
            type: "success",
            message: "Account created. You can sign in with your new credentials.",
        });

    };

    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center">
            
            <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-10 bg-neutral-100 dark:bg-neutral-900 rounded-lg shadow-md">

                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold">Sign up</h2>
                            <p className="text-sm text-muted-foreground">
                                Start in under a minute.
                            </p>
                        </div>
                        <span className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            DB Lab
                        </span>
                    </div>

                    {response && (
                        <Alert
                            className="mt-6"
                            variant={response.type === "error" ? "destructive" : "default"}
                        >
                            {response.type === "error" ? (
                                <AlertTriangleIcon />
                            ) : (
                                <CheckCircle2Icon />
                            )}
                            <AlertTitle>{response.message}</AlertTitle>
                            <AlertDescription>
                                {response.type === "success"
                                    ? "Sign in to continue and start your first project."
                                    : "Double-check your details and try again."}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-6 space-y-6"
                    >
                        <FieldGroup>
                            <Controller
                                name="username"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-username">
                                            Username
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-username"
                                            aria-invalid={fieldState.invalid}
                                            className="h-11"
                                            placeholder="Akbar Ali"
                                            autoComplete="username"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-email"
                                            type="email"
                                            aria-invalid={fieldState.invalid}
                                            className="h-11"
                                            placeholder="f2024065351@umt.edu.pk"
                                            autoComplete="email"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-password">
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-password"
                                            type="password"
                                            aria-invalid={fieldState.invalid}
                                            className="h-11"
                                            placeholder="*********"
                                            autoComplete="new-password"
                                        />
                                        <FieldDescription>
                                            Use at least 6 characters.
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <Button
                            type="submit"
                            className="h-11 w-full"
                            disabled={form.formState.isSubmitting}
                        >
                            Create account
                        </Button>
                    </form>

                    <p className="mt-6 text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/sign-in"
                            className="font-medium text-foreground underline decoration-transparent underline-offset-4 transition hover:decoration-foreground"
                        >
                            Sign in
                        </Link>
                    </p>
            </div>
        </div>
    );
}
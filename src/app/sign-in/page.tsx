"use client";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schema/signInSchema";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import { signIn } from "next-auth/react";

type ResponseState = {
    message: string;
};

export default function SignInPage() {
    const [response, setResponse] = useState<ResponseState | null>(null);
    const router = useRouter();
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: true,
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setResponse(null);
        const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (res?.error) {
            setResponse({
                message: res.error || "Sign in failed. Try again.",
            });
            return;
        }

        router.push("/");
    };

    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center">
            <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-10 bg-neutral-100 dark:bg-neutral-900 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold">Sign in</h2>
                            <p className="text-sm text-muted-foreground">
                                Enter your email and password.
                            </p>
                        </div>
                        <span className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            DB Lab
                        </span>
                    </div>

                    {response && (
                        <Alert className="mt-6" variant="destructive">
                            <AlertTriangleIcon />
                            <AlertTitle>{response.message}</AlertTitle>
                            <AlertDescription>
                                Check your credentials and try again.
                            </AlertDescription>
                        </Alert>
                    )}

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-6 space-y-6"
                    >
                        <FieldGroup>
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
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="rememberMe"
                                control={form.control}
                                render={({ field }) => (
                                    <label
                                        htmlFor="form-remember"
                                        className="flex items-center gap-2 text-sm text-muted-foreground"
                                    >
                                        <Checkbox
                                            id="form-remember"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        Remember me for 7 days
                                    </label>
                                )}
                            />
                        </FieldGroup>
                        <Button
                            type="submit"
                            className="h-11 w-full"
                            disabled={form.formState.isSubmitting}
                        >
                            Sign in
                        </Button>
                    </form>

                    <p className="mt-6 text-sm text-muted-foreground">
                        Need an account?{" "}
                        <Link
                            href="/sign-up"
                            className="font-medium text-foreground underline decoration-transparent underline-offset-4 transition hover:decoration-foreground"
                        >
                            Sign up
                        </Link>
                    </p>
            </div>
        </div>
    );
}

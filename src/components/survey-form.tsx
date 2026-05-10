"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { surveySchema } from "@/schema/surveySchema";
import { AlertTriangleIcon, CheckCircle2Icon } from "lucide-react";

type SurveyFormValues = z.infer<typeof surveySchema>;

type ResponseState = {
    type: "success" | "error";
    message: string;
};

const ratingOptions = [1, 2, 3, 4, 5];

export default function SurveyForm() {
    const [response, setResponse] = useState<ResponseState | null>(null);
    const form = useForm<SurveyFormValues>({
        resolver: zodResolver(surveySchema),
        defaultValues: {
            full_name: "",
            age: 18,
            gender: "Male",
            email: "",
            preferred_programming_language: "",
            programming_languages_known: "",
            favorite_ide: "",
            preferred_lab_time: "",
            lab_infrastructure_rating: undefined,
            satisfaction_level: undefined,
            suggestions: "",
            additional_feedback: "",
        },
    });

    const onSubmit = async (data: SurveyFormValues) => {
        setResponse(null);

        const res = await fetch("/api/surveys", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const payload = await res.json().catch(() => ({}));
            setResponse({
                type: "error",
                message: payload?.message || "Survey submission failed. Try again.",
            });
            return;
        }

        setResponse({
            type: "success",
            message: "Survey submitted. Thanks for your feedback!",
        });
        form.reset();
    };

    return (
        <div className="w-full rounded-lg bg-neutral-100 p-6 shadow-md dark:bg-neutral-900 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-semibold">Lab Experience Survey</h2>
                    <p className="text-sm text-muted-foreground">
                        Help us improve the DB Lab sessions.
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
                        {response.type === "error"
                            ? "Double-check the form fields and try again."
                            : "We review every response to improve the labs."}
                    </AlertDescription>
                </Alert>
            )}

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-6 space-y-8"
            >
                <FieldSet>
                    <FieldLegend>About you</FieldLegend>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Controller
                            name="full_name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="survey-full-name">
                                        Full name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="survey-full-name"
                                        aria-invalid={fieldState.invalid}
                                        className="h-11"
                                        placeholder="Akbar Ali"
                                        autoComplete="name"
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
                                    <FieldLabel htmlFor="survey-email">Email</FieldLabel>
                                    <Input
                                        {...field}
                                        id="survey-email"
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
                            name="age"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="survey-age">Age</FieldLabel>
                                    <Input
                                        {...field}
                                        id="survey-age"
                                        type="number"
                                        min={10}
                                        max={120}
                                        aria-invalid={fieldState.invalid}
                                        className="h-11"
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            field.onChange(
                                                value === "" ? undefined : Number(value)
                                            );
                                        }}
                                        value={field.value ?? ""}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="gender"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="survey-gender">Gender</FieldLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger
                                            id="survey-gender"
                                            aria-invalid={fieldState.invalid}
                                            className="h-11 w-full"
                                        >
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                </FieldSet>

                <FieldSet>
                    <FieldLegend>Programming background</FieldLegend>
                    <FieldGroup>
                        <Controller
                            name="preferred_programming_language"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="survey-preferred-language">
                                        Preferred programming language
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="survey-preferred-language"
                                        aria-invalid={fieldState.invalid}
                                        className="h-11"
                                        placeholder="SQL"
                                    />
                                    <FieldDescription>Optional</FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="programming_languages_known"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="survey-languages-known">
                                        Programming languages known
                                    </FieldLabel>
                                    <Textarea
                                        {...field}
                                        id="survey-languages-known"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="C, C++, JavaScript, SQL"
                                    />
                                    <FieldDescription>
                                        Optional, separate with commas.
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="favorite_ide"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="survey-favorite-ide">
                                        Favorite IDE
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="survey-favorite-ide"
                                        aria-invalid={fieldState.invalid}
                                        className="h-11"
                                        placeholder="VS Code"
                                    />
                                    <FieldDescription>Optional</FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </FieldSet>

                <FieldSet>
                    <FieldLegend>Lab experience</FieldLegend>
                    <FieldGroup>
                        <Controller
                            name="preferred_lab_time"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="survey-lab-time">
                                        Preferred lab time
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="survey-lab-time"
                                        aria-invalid={fieldState.invalid}
                                        className="h-11"
                                        placeholder="Morning, afternoon, or evening"
                                    />
                                    <FieldDescription>Optional</FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <div className="grid gap-6 md:grid-cols-2">
                            <Controller
                                name="lab_infrastructure_rating"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="survey-lab-rating">
                                            Lab infrastructure rating
                                        </FieldLabel>
                                        <Select
                                            value={
                                                field.value === undefined
                                                    ? undefined
                                                    : String(field.value)
                                            }
                                            onValueChange={(value) =>
                                                field.onChange(Number(value))
                                            }
                                        >
                                            <SelectTrigger
                                                id="survey-lab-rating"
                                                aria-invalid={fieldState.invalid}
                                                className="h-11 w-full"
                                            >
                                                <SelectValue placeholder="Select a rating" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ratingOptions.map((rating) => (
                                                    <SelectItem
                                                        key={rating}
                                                        value={String(rating)}
                                                    >
                                                        {rating}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldDescription>
                                            Optional, 1 to 5.
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="satisfaction_level"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="survey-satisfaction">
                                            Overall satisfaction
                                        </FieldLabel>
                                        <Select
                                            value={
                                                field.value === undefined
                                                    ? undefined
                                                    : String(field.value)
                                            }
                                            onValueChange={(value) =>
                                                field.onChange(Number(value))
                                            }
                                        >
                                            <SelectTrigger
                                                id="survey-satisfaction"
                                                aria-invalid={fieldState.invalid}
                                                className="h-11 w-full"
                                            >
                                                <SelectValue placeholder="Select a rating" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ratingOptions.map((rating) => (
                                                    <SelectItem
                                                        key={rating}
                                                        value={String(rating)}
                                                    >
                                                        {rating}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldDescription>
                                            Optional, 1 to 5.
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>
                    </FieldGroup>
                </FieldSet>

                <FieldSet>
                    <FieldLegend>Additional feedback</FieldLegend>
                    <FieldGroup>
                        <Controller
                            name="suggestions"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="survey-suggestions">
                                        Suggestions for improvement
                                    </FieldLabel>
                                    <Textarea
                                        {...field}
                                        id="survey-suggestions"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Share any improvements you would like."
                                    />
                                    <FieldDescription>Optional</FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="additional_feedback"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="survey-additional-feedback">
                                        Additional feedback
                                    </FieldLabel>
                                    <Textarea
                                        {...field}
                                        id="survey-additional-feedback"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Anything else we should know?"
                                    />
                                    <FieldDescription>Optional</FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </FieldSet>

                <Button
                    type="submit"
                    className="h-11 w-full sm:w-auto"
                    disabled={form.formState.isSubmitting}
                >
                    Submit survey
                </Button>
            </form>
        </div>
    );
}

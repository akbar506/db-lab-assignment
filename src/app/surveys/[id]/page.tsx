import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ComponentType } from "react";
import {
    ArrowLeftIcon,
    ClockIcon,
    Code2Icon,
    MailIcon,
    MonitorIcon,
    StarIcon,
    UserIcon,
} from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";

type SurveyDetailPageProps = {
    params: Promise<{ id: string }>;
};

const formatDate = (date?: Date | null) => {
    if (!date) {
        return "Not recorded";
    }

    return new Intl.DateTimeFormat("en", {
        dateStyle: "full",
        timeStyle: "short",
    }).format(date);
};

const formatValue = (value?: string | number | null) => {
    if (value === null || value === undefined || value === "") {
        return "Not provided";
    }

    return String(value);
};

const formatRating = (rating?: number | null) => {
    if (!rating) {
        return "Not rated";
    }

    return `${rating}/5`;
};

function DetailItem({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: string;
    icon: ComponentType<{ className?: string }>;
}) {
    return (
        <div className="rounded-lg border bg-card p-4 text-card-foreground">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="size-4" />
                <span>{label}</span>
            </div>
            <p className="mt-2 break-words text-base font-medium">{value}</p>
        </div>
    );
}

function TextBlock({ label, value }: { label: string; value?: string | null }) {
    return (
        <section>
            <h2 className="text-base font-semibold">{label}</h2>
            <p className="mt-2 whitespace-pre-wrap rounded-lg border bg-card p-4 text-sm leading-6 text-card-foreground">
                {formatValue(value)}
            </p>
        </section>
    );
}

export default async function SurveyDetailPage({ params }: SurveyDetailPageProps) {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/sign-in");
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    });

    if (!user) {
        redirect("/sign-in");
    }

    const survey = await db.survey.findFirst({
        where: {
            id,
            user_id: user.id,
        },
    });

    if (!survey) {
        notFound();
    }

    return (
        <main className="min-h-screen w-full bg-background">
            <div className="mx-auto flex w-full max-w-5xl flex-col px-6 py-10 sm:py-14">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Button asChild variant="outline">
                        <Link href="/surveys">
                            <ArrowLeftIcon />
                            Back to surveys
                        </Link>
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Submitted {formatDate(survey.submission_date)}
                    </p>
                </div>

                <div className="mt-8">
                    <p className="text-sm font-medium text-muted-foreground">
                        Survey Detail
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold tracking-normal">
                        {survey.full_name}
                    </h1>
                    <p className="mt-2 text-muted-foreground">{survey.email}</p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailItem
                        label="Age"
                        value={formatValue(survey.age)}
                        icon={UserIcon}
                    />
                    <DetailItem
                        label="Gender"
                        value={formatValue(survey.gender)}
                        icon={UserIcon}
                    />
                    <DetailItem
                        label="Email"
                        value={formatValue(survey.email)}
                        icon={MailIcon}
                    />
                    <DetailItem
                        label="Preferred language"
                        value={formatValue(
                            survey.preferred_programming_language
                        )}
                        icon={Code2Icon}
                    />
                    <DetailItem
                        label="Favorite IDE"
                        value={formatValue(survey.favorite_ide)}
                        icon={MonitorIcon}
                    />
                    <DetailItem
                        label="Preferred lab time"
                        value={formatValue(survey.preferred_lab_time)}
                        icon={ClockIcon}
                    />
                    <DetailItem
                        label="Lab infrastructure"
                        value={formatRating(survey.lab_infrastructure_rating)}
                        icon={StarIcon}
                    />
                    <DetailItem
                        label="Satisfaction"
                        value={formatRating(survey.satisfaction_level)}
                        icon={StarIcon}
                    />
                </div>

                <Separator className="my-8" />

                <div className="grid gap-6">
                    <TextBlock
                        label="Programming languages known"
                        value={survey.programming_languages_known}
                    />
                    <TextBlock
                        label="Suggestions for improvement"
                        value={survey.suggestions}
                    />
                    <TextBlock
                        label="Additional feedback"
                        value={survey.additional_feedback}
                    />
                </div>
            </div>
        </main>
    );
}

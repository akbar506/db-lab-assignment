import Link from "next/link";
import { redirect } from "next/navigation";
import { ClipboardListIcon, EyeIcon, PlusIcon } from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

const formatDate = (date?: Date | null) => {
    if (!date) {
        return "Not recorded";
    }

    return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};

const formatRating = (rating?: number | null) => {
    if (!rating) {
        return "Not rated";
    }

    return `${rating}/5`;
};

export default async function SurveysPage() {
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

    const surveys = await db.survey.findMany({
        where: { user_id: user.id },
        orderBy: { submission_date: "desc" },
        select: {
            id: true,
            full_name: true,
            email: true,
            preferred_programming_language: true,
            favorite_ide: true,
            lab_infrastructure_rating: true,
            satisfaction_level: true,
            submission_date: true,
        },
    });

    return (
        <main className="min-h-screen w-full bg-background">
            <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10 sm:py-14">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            DB Lab
                        </p>
                        <h1 className="text-3xl font-semibold tracking-normal">
                            Saved Surveys
                        </h1>
                    </div>
                    <Button asChild>
                        <Link href="/">
                            <PlusIcon />
                            New survey
                        </Link>
                    </Button>
                </div>

                {surveys.length === 0 ? (
                    <div className="mt-10 rounded-lg border bg-card p-8 text-card-foreground">
                        <div className="flex size-12 items-center justify-center rounded-md bg-muted">
                            <ClipboardListIcon className="size-6 text-muted-foreground" />
                        </div>
                        <h2 className="mt-5 text-xl font-semibold">No surveys saved yet</h2>
                        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                            Submit your first lab experience survey and it will appear here.
                        </p>
                        <Button asChild className="mt-6">
                            <Link href="/">Create survey</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {surveys.map((survey) => (
                            <Link
                                key={survey.id}
                                href={`/surveys/${survey.id}`}
                                className="group rounded-lg border bg-card p-5 text-card-foreground shadow-xs transition hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h2 className="truncate text-lg font-semibold">
                                            {survey.full_name}
                                        </h2>
                                        <p className="truncate text-sm text-muted-foreground">
                                            {survey.email}
                                        </p>
                                    </div>
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground transition group-hover:text-foreground">
                                        <EyeIcon className="size-4" />
                                    </span>
                                </div>

                                <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <dt className="text-muted-foreground">Language</dt>
                                        <dd className="mt-1 truncate font-medium">
                                            {survey.preferred_programming_language ||
                                                "Not provided"}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground">IDE</dt>
                                        <dd className="mt-1 truncate font-medium">
                                            {survey.favorite_ide || "Not provided"}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground">Lab rating</dt>
                                        <dd className="mt-1 font-medium">
                                            {formatRating(
                                                survey.lab_infrastructure_rating
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Satisfaction
                                        </dt>
                                        <dd className="mt-1 font-medium">
                                            {formatRating(survey.satisfaction_level)}
                                        </dd>
                                    </div>
                                </dl>

                                <p className="mt-5 border-t pt-4 text-xs text-muted-foreground">
                                    Submitted {formatDate(survey.submission_date)}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

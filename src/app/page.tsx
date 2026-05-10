import Link from "next/link";
import SurveyForm from "@/components/survey-form";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <main className="min-h-screen w-full bg-background">
            <div className="mx-auto flex w-full max-w-4xl flex-col px-6 py-10 sm:py-14">
                <div className="mb-6 flex justify-end">
                    <Button asChild variant="outline">
                        <Link href="/surveys">View saved surveys</Link>
                    </Button>
                </div>
                <SurveyForm />
            </div>
        </main>
    );
}

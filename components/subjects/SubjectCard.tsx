import Link from "next/link";
import { LucideIcon } from "lucide-react";

type SubjectCardProps = {
    subjectKey: string;
    title: string;
    icon: LucideIcon;
    notes: number;
    materials: number;
    progress: number;
};

export function SubjectCard({ subjectKey, title, icon: Icon, notes, materials, progress }: SubjectCardProps) {
    return (
        <Link
            href={`/subjects/${subjectKey}`}
            className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">Workspace</h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-900">
                    <Icon size={24} />
                </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-3 text-center text-sm text-slate-600">
                    <p className="text-xs uppercase tracking-[0.22em]">Notes</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{notes}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-3 text-center text-sm text-slate-600">
                    <p className="text-xs uppercase tracking-[0.22em]">Materials</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{materials}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-3 text-center text-sm text-slate-600">
                    <p className="text-xs uppercase tracking-[0.22em]">Progress</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{progress}%</p>
                </div>
            </div>
        </Link>
    );
}

import { SubjectWorkspace } from "../../../components/subjects/SubjectWorkspace";
import { SUBJECT_KEYS, SubjectKey } from "../../../components/subjects/useSubjectWorkspace";

type SubjectPageProps = {
    params: {
        subject: string;
    };
};

const VALID_SUBJECTS = new Set(SUBJECT_KEYS);

export default function SubjectPage({ params }: SubjectPageProps) {
    const subject = params.subject as SubjectKey;
    if (!VALID_SUBJECTS.has(subject)) {
        return (
            <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-semibold text-slate-900">Subject not found</h1>
                    <p className="mt-3 text-sm text-slate-500">Choose one of the available subject workspaces from the subjects dashboard.</p>
                </div>
            </main>
        );
    }

    return <SubjectWorkspace subject={subject} />;
}

export function generateStaticParams() {
    return SUBJECT_KEYS.map((subject) => ({
        subject,
    }));
}

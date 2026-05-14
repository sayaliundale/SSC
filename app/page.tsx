import {
    ScheduleWidget,
    VocabularyWidget,
    QuickNotesWidget,
    CurrentAffairsWidget,
    RevisionReminderWidget,
    SubjectAccessCards,
} from '../components/dashboard';

export default function DashboardPage() {
    return (
        <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-3xl font-semibold text-slate-900">SSC Dashboard</h1>
                <p className="mt-3 max-w-2xl text-slate-600">
                    Your study overview, revision reminders, and quick access cards for exam prep.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <ScheduleWidget />
                <VocabularyWidget />
                <QuickNotesWidget />
                <CurrentAffairsWidget />
                <RevisionReminderWidget />
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Quick Subject Access</h2>
                        <p className="mt-1 text-sm text-slate-500">Jump quickly into the subject you want to revise next.</p>
                    </div>
                </div>
                <SubjectAccessCards />
            </div>
        </section>
    );
}

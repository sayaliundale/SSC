import WidgetCard from '../WidgetCard';
import Link from 'next/link';

const editIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path d="M4 20h4.5L20 8.5a1.5 1.5 0 0 0-2.12-2.12L6.38 17.38V22H4v-2z" />
    </svg>
);

const trashIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
    </svg>
);

const heartIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path d="M12 21s-6.5-4.35-9-8.5C1.4 8 4.23 4 8.5 4c2.35 0 4.5 1.5 5.5 3.75C15 5.5 17.15 4 19.5 4 23.77 4 26.6 8 23 12.5 20.5 16.7 12 21 12 21z" />
    </svg>
);

const bookmarkIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path d="M6 4h12v18l-6-4-6 4V4z" />
    </svg>
);


import { useNotes } from '../../notes/useNotes';

export function QuickNotesWidget() {
    const { notes, loading } = useNotes();
    const previewNotes = notes.slice(0, 3);

    // Helper to strip HTML tags for preview
    const stripHtml = (html: string) => {
        if (typeof window === 'undefined') return html;
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    return (
        <WidgetCard title="Quick Notes" subtitle="Capture study notes and reminders">
            <div className="space-y-4">
                <div className="rounded-[2rem] bg-amber-50 p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold text-slate-800">Study notes</p>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Sticky</span>
                    </div>
                    <div className="space-y-3 text-sm text-slate-700">
                        {loading ? (
                            <p className="text-slate-500">Loading notes...</p>
                        ) : previewNotes.length === 0 ? (
                            <p className="text-slate-500">No notes yet. Start writing to see them here.</p>
                        ) : (
                            previewNotes.map((item) => (
                                <div key={item._id} className="flex items-start gap-3">
                                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500">•</span>
                                    <div>
                                        <p className="font-semibold text-slate-900">{item.title}</p>
                                        <p className="mt-1 line-clamp-1 text-xs text-slate-600">{stripHtml(item.content)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-white px-3 py-1">✔ Checkbox</span>
                        <span className="rounded-full bg-white px-3 py-1">✨ Highlight</span>
                        <span className="rounded-full bg-white px-3 py-1">• Bullets</span>
                    </div>
                </div>
                <Link href="/notes" className="block w-full rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800">
                    Open Notes
                </Link>
            </div>
        </WidgetCard>
    );
}


export function CurrentAffairsWidget() {
    const items = [
        { title: 'RBI repo rate updated', date: 'May 12', tag: 'Economy' },
        { title: 'New railway policy announced', date: 'May 11', tag: 'Polity' },
        { title: 'G20 summit updates', date: 'May 10', tag: 'International' },
    ];

    return (
        <WidgetCard title="Current Affairs" subtitle="Keep the latest headlines handy">
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                    <span>{item.date}</span>
                                    <span className="rounded-full bg-slate-200 px-2 py-1">{item.tag}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100" aria-label="Bookmark article">{bookmarkIcon}</button>
                                <button className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800">Read more</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </WidgetCard>
    );
}

export function RevisionReminderWidget() {
    const reminders = [
        { label: '5 Vocabulary words', color: 'text-rose-600' },
        { label: 'Algebra formulas', color: 'text-sky-600' },
        { label: '3 wrong mock questions', color: 'text-amber-700' },
    ];

    return (
        <WidgetCard title="Revision Reminder" subtitle="Focus your next review session" className="lg:col-span-2">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">🔥</span>
                    <div>
                        <p>Needs Revision</p>
                        <p className="text-sm text-slate-500">Quick reminder of study gaps.</p>
                    </div>
                </div>
                <div className="mt-6 space-y-3">
                    {reminders.map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-3xl bg-white px-4 py-3 shadow-sm">
                            <span className={`text-sm font-semibold ${item.color}`}>{item.label}</span>
                            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Pending</span>
                        </div>
                    ))}
                </div>
            </div>
        </WidgetCard>
    );
}

export function SubjectAccessCards() {
    const subjects = [
        { name: 'Quant', progress: 78, icon: '∑', accent: 'bg-emerald-100 text-emerald-700' },
        { name: 'Reasoning', progress: 54, icon: '⧗', accent: 'bg-sky-100 text-sky-700' },
        { name: 'English', progress: 63, icon: '✍️', accent: 'bg-amber-100 text-amber-700' },
        { name: 'GK', progress: 42, icon: '🌍', accent: 'bg-violet-100 text-violet-700' },
    ];

    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {subjects.map((subject) => (
                <button key={subject.name} type="button" className="group rounded-[2rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${subject.accent} text-lg font-semibold`}>{subject.icon}</div>
                    <div className="mt-4">
                        <h3 className="text-base font-semibold text-slate-900">{subject.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">Quick access card</p>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-2 rounded-full bg-slate-900 transition-all" style={{ width: `${subject.progress}%` }} />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-600">{subject.progress}% complete</p>
                </button>
            ))}
        </section>
    );
}

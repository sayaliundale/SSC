'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

const titleMap: Record<string, string> = {
    '/': 'Dashboard',
    '/schedule': 'Schedule',
    '/vocabulary': 'Vocabulary',
    '/current-affairs': 'Current Affairs',
    '/notes': 'Notes',
    '/subjects': 'Subjects',
    '/settings': 'Settings',
};

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    }).format(date);
};

export default function TopBar() {
    const pathname = usePathname();
    const pageTitle = titleMap[pathname] ?? 'Dashboard';
    const today = useMemo(() => formatDate(new Date()), []);

    return (
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-3xl font-semibold text-slate-900">{pageTitle}</h1>
            </div>
            <div className="flex flex-col items-start gap-1 text-sm text-slate-600 sm:items-end">
                <span>{today}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Hello, Student</span>
            </div>
        </div>
    );
}

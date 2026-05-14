'use client';

import {
    BookOpen,
    CalendarDays,
    CircleDot,
    FileText,
    LayoutGrid,
    Settings,
    Sparkles,
} from 'lucide-react';
import SidebarItem from './SidebarItem';

const navItems = [
    { href: '/', label: 'Dashboard', Icon: LayoutGrid },
    { href: '/schedule', label: 'Schedule', Icon: CalendarDays },
    { href: '/vocabulary', label: 'Vocabulary', Icon: BookOpen },
    { href: '/current-affairs', label: 'Current Affairs', Icon: CircleDot },
    { href: '/notes', label: 'Notes', Icon: FileText },
    { href: '/subjects', label: 'Subjects', Icon: Sparkles },
    { href: '/settings', label: 'Settings', Icon: Settings },
];

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 z-20 h-screen w-[240px] border-r border-slate-200 bg-white px-5 py-6 shadow-sm">
            <div className="flex h-full flex-col justify-between">
                <div>
                    <div className="mb-10 px-1">
                        <p className="text-lg font-semibold text-slate-900">SSC Prep</p>
                        <p className="mt-1 text-sm text-slate-500">Study dashboard shell</p>
                    </div>
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <SidebarItem key={item.href} href={item.href} label={item.label} Icon={item.Icon} />
                        ))}
                    </nav>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">Study mode</p>
                    <p className="mt-2">A calm workspace for your SSC preparation.</p>
                </div>
            </div>
        </aside>
    );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
    href: string;
    label: string;
    Icon: LucideIcon;
}

export default function SidebarItem({ href, label, Icon }: SidebarItemProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${isActive
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 '
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
        >
            <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
            <span>{label}</span>
        </Link>
    );
}

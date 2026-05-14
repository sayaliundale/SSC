'use client';

type WidgetCardProps = {
    title: string;
    subtitle?: string;
    className?: string;
    children: React.ReactNode;
};

export default function WidgetCard({ title, subtitle, className = '', children }: WidgetCardProps) {
    return (
        <section className={`rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
                    {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
                </div>
            </div>
            {children}
        </section>
    );
}

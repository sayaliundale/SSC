import { FileText, Image, Search } from "lucide-react";
import { SubjectMaterial } from "./useSubjectWorkspace";

type MaterialsGridProps = {
    materials: SubjectMaterial[];
    search: string;
    filter: "all" | "pdf" | "image";
    onSearchChange: (value: string) => void;
    onFilterChange: (value: "all" | "pdf" | "image") => void;
    onRemove: (id: string) => void;
};

export function MaterialsGrid({ materials, search, filter, onSearchChange, onFilterChange, onRemove }: MaterialsGridProps) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Materials</h3>
                    <p className="mt-1 text-sm text-slate-500">Search and filter your uploaded files.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <label className="relative block w-full max-w-xs">
                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            value={search}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder="Search materials"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </label>
                    <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-2 text-sm text-slate-600">
                        <button
                            type="button"
                            onClick={() => onFilterChange("all")}
                            className={`rounded-2xl px-3 py-2 transition ${filter === "all" ? "bg-slate-900 text-white" : "hover:bg-white"}`}
                        >
                            All
                        </button>
                        <button
                            type="button"
                            onClick={() => onFilterChange("pdf")}
                            className={`rounded-2xl px-3 py-2 transition ${filter === "pdf" ? "bg-slate-900 text-white" : "hover:bg-white"}`}
                        >
                            PDFs
                        </button>
                        <button
                            type="button"
                            onClick={() => onFilterChange("image")}
                            className={`rounded-2xl px-3 py-2 transition ${filter === "image" ? "bg-slate-900 text-white" : "hover:bg-white"}`}
                        >
                            Images
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid gap-4">
                {materials.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                        No materials yet. Upload a PDF or image to get started.
                    </div>
                ) : (
                    materials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
                                    {material.type === "pdf" ? <FileText size={20} /> : <Image size={20} />}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900">{material.name}</p>
                                    <p className="mt-1 text-xs text-slate-500">Uploaded {new Date(material.uploadedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => onRemove(material.id)}
                                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

type UploadBoxProps = {
    onUpload: (files: FileList) => void;
};

export function UploadBox({ onUpload }: UploadBoxProps) {
    return (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm font-semibold text-slate-900">Upload materials</p>
            <p className="mt-2 text-sm text-slate-500">Add PDFs or images to keep your study resources together.</p>
            <label className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Upload files
                <input
                    type="file"
                    accept="application/pdf,image/*"
                    multiple
                    className="sr-only"
                    onChange={(event) => {
                        if (!event.target.files) return;
                        onUpload(event.target.files);
                        event.target.value = "";
                    }}
                />
            </label>
        </div>
    );
}

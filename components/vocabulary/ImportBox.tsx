'use client';

import { useState } from 'react';
import type { VocabType, VocabularyItem } from './useVocabulary';

type ImportItem = Omit<VocabularyItem, 'id' | 'mastered' | 'bookmarked' | 'revisionCount' | 'lastReviewed'>;

type ParsedImport = {
    word: string;
    type: VocabType;
    meaning: string;
    synonym: string;
    source: 'imported';
    difficulty: 'medium';
};

type ImportBoxProps = {
    onImport: (items: ImportItem[]) => void;
};

const detectType = (line: string): VocabType => {
    if (line.includes('idiom')) return 'idiom';
    if (line.includes('one-word')) return 'one-word';
    return 'synonym';
};

export default function ImportBox({ onImport }: ImportBoxProps) {
    const [text, setText] = useState('');
    const [status, setStatus] = useState<string | null>(null);

    const parseLines = (): ImportItem[] => {
        const lines = text
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        if (lines.length === 0) {
            setStatus('Paste at least one vocabulary line to import.');
            return [];
        }

        const parsed: Array<ParsedImport | null> = lines.map((line) => {
            const separator = line.includes(' - ') ? ' - ' : line.includes(':') ? ':' : '-';
            const [wordPart, valuePart] = line.split(separator).map((value) => value.trim());
            if (!wordPart || !valuePart) return null;

            return {
                word: wordPart,
                type: detectType(line),
                meaning: valuePart,
                synonym: valuePart,
                source: 'imported',
                difficulty: 'medium',
            };
        });

        return parsed.filter((item): item is ParsedImport => item !== null);
    };

    const handleImport = () => {
        const parsed = parseLines();
        if (parsed.length === 0) {
            setStatus('No valid vocabulary lines were detected.');
            return;
        }
        onImport(parsed);
        setText('');
        setStatus(`Imported ${parsed.length} item${parsed.length === 1 ? '' : 's'}.`);
    };

    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
                <p className="text-sm text-slate-500">Import Vocabulary</p>
                <h2 className="text-2xl font-semibold text-slate-900">Paste word pairs</h2>
            </div>
            <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows={8}
                placeholder="Abandon - Forsake\nCalm - Peaceful\nBold - Brave"
                className="w-full rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                    type="button"
                    onClick={handleImport}
                    className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    Import Vocabulary
                </button>
                {status ? <p className="text-sm text-slate-500">{status}</p> : null}
            </div>
        </section>
    );
}

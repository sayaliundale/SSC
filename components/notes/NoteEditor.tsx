"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Bold, Italic, List, CheckSquare, Type, RotateCcw, RotateCw, Highlighter as HighlightIcon } from "lucide-react";
import { Note } from "./useNotes";

const SUBJECTS: Array<Note["subject"]> = ["Quant", "English", "Reasoning", "GK"];

type NoteEditorProps = {
    note: Note | null;
    onUpdateNote: (id: string, updates: Partial<Omit<Note, "_id" | "createdAt">>) => void;
    onDeleteNote: (id: string) => void;
};

export function NoteEditor({ note, onUpdateNote, onDeleteNote }: NoteEditorProps) {
    const editor = useEditor({
        editable: Boolean(note),
        extensions: [StarterKit.configure({
            bulletList: {
                keepMarks: true,
                keepAttributes: false,
            },
        }), Highlight, TaskList, TaskItem],
        content: note?.content ?? "",
        onUpdate: ({ editor }) => {
            if (!note) return;
            const html = editor.getHTML();
            if (html !== note.content) {
                onUpdateNote(note._id, { content: html });
            }
        },
    });

    useEffect(() => {
        if (!editor) return;
        editor.setEditable(Boolean(note));
    }, [editor, note]);

    useEffect(() => {
        if (!editor) return;
        if (!note) {
            editor.commands.clearContent();
            return;
        }

        editor.commands.setContent(note.content);
        editor.commands.focus();
    }, [editor, note?._id]);

    if (!note) {
        return (
            <div className="flex h-full min-h-[calc(100vh-3rem)] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <p className="text-xl font-semibold text-slate-900">No note selected</p>
                <p className="mt-3 max-w-xs text-sm text-slate-500">
                    Pick a note from the left, or create a new note to start writing.
                </p>
            </div>
        );
    }

    const setTitle = (value: string) => onUpdateNote(note._id, { title: value });

    return (
        <section className="flex h-full min-h-[calc(100vh-3rem)] flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <input
                            value={note.title}
                            onChange={(event) => setTitle(event.target.value)}
                            className="w-full border-0 border-b border-slate-200 bg-transparent pb-2 text-2xl font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                            placeholder="Untitled note"
                        />
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            <span>Last updated {new Date(note.updatedAt).toLocaleString()}</span>
                            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-400" />
                            <span>{note.subject}</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => onDeleteNote(note._id)}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                    >
                        Delete
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        Subject:
                        <select
                            value={note.subject}
                            onChange={(event) => onUpdateNote(note._id, { subject: event.target.value as Note["subject"] })}
                            className="rounded-xl border-none bg-transparent text-sm text-slate-900 outline-none"
                        >
                            {SUBJECTS.map((subject) => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 rounded-3xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
                        <ToolbarButton active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()} ariaLabel="Bold">
                            <Bold size={16} />
                        </ToolbarButton>
                        <ToolbarButton active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()} ariaLabel="Italic">
                            <Italic size={16} />
                        </ToolbarButton>
                        <ToolbarButton active={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} ariaLabel="Heading">
                            <Type size={16} />
                        </ToolbarButton>
                        <ToolbarButton active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()} ariaLabel="Bullet list">
                            <List size={16} />
                        </ToolbarButton>
                        <ToolbarButton active={editor?.isActive("taskList")} onClick={() => editor?.chain().focus().toggleTaskList().run()} ariaLabel="Checkbox list">
                            <CheckSquare size={16} />
                        </ToolbarButton>
                        <ToolbarButton active={false} onClick={() => editor?.chain().focus().toggleHighlight().run()} ariaLabel="Highlight">
                            <HighlightIcon size={16} />
                        </ToolbarButton>
                        <ToolbarButton active={false} onClick={() => editor?.chain().focus().undo().run()} ariaLabel="Undo">
                            <RotateCcw size={16} />
                        </ToolbarButton>
                        <ToolbarButton active={false} onClick={() => editor?.chain().focus().redo().run()} ariaLabel="Redo">
                            <RotateCw size={16} />
                        </ToolbarButton>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden p-6">
                <div className="h-full min-h-[400px] bg-slate-50 p-6 text-slate-900">
                    <EditorContent editor={editor} className="min-h-[360px] w-full focus:outline-none" />
                </div>
            </div>
        </section>
    );
}

function ToolbarButton({
    active,
    onClick,
    children,
    ariaLabel,
}: {
    active: boolean | undefined;
    onClick: () => void;
    children: React.ReactNode;
    ariaLabel: string;
}) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            onClick={onClick}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition ${active ? "border-slate-900 bg-slate-900 text-white" : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
        >
            {children}
        </button>
    );
}

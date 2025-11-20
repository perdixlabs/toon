"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, placeholder as cmPlaceholder } from "@codemirror/view";
import { json } from "@codemirror/lang-json";
import { vsCodeTheme } from "@/lib/codemirror-theme";
import { toon } from "@/lib/codemirror-toon";

type CodeEditorProps = {
  readonly value: string;
  readonly placeholder: string;
  readonly hasError: boolean;
  readonly readOnly?: boolean;
  readonly language?: "json" | "toon";
  readonly onRepair?: () => void;
  readonly onCopy?: () => void;
  readonly onChange: (value: string) => void;
};

export function CodeEditor({
  value,
  placeholder,
  hasError,
  readOnly = false,
  language = "json",
  onRepair,
  onCopy,
  onChange,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const languageExtension = language === "toon" ? toon() : json();

    const state = EditorState.create({
      doc: value,
      extensions: [
        vsCodeTheme,
        languageExtension,
        cmPlaceholder(placeholder),
        EditorState.readOnly.of(readOnly),
        EditorView.editable.of(!readOnly),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !readOnly) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [language, placeholder, readOnly]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentValue = view.state.doc.toString();
    if (value !== currentValue) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return (
    <div className="flex h-full flex-col">
      <div
        className={`flex-1 rounded-2xl border ${
          hasError ? "border-red-400/50" : "border-white/10"
        } bg-black/20 relative overflow-hidden`}
      >
        <div
          ref={editorRef}
          className="h-full w-full"
        />
        {hasError && onRepair && (
          <button
            type="button"
            onClick={onRepair}
            className="cursor-pointer absolute bottom-3 right-3 rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-500"
          >
            Repair JSON
          </button>
        )}
        {!hasError && onCopy && value.trim().length > 0 && (
          <button
            type="button"
            onClick={onCopy}
            className="cursor-pointer absolute bottom-3 right-3 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
          >
            Copy
          </button>
        )}
      </div>
    </div>
  );
}

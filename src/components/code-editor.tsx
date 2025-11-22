"use client";

import { useEffect, useRef, useState } from "react";
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
  readonly repairFailed?: boolean;
  readonly onRepair?: () => void;
  readonly onCopy?: () => void;
  readonly onFormat?: () => boolean;
  readonly onMinify?: () => boolean;
  readonly onChange: (value: string) => void;
};

export function CodeEditor({
  value,
  placeholder,
  hasError,
  readOnly = false,
  language = "json",
  repairFailed = false,
  onRepair,
  onCopy,
  onFormat,
  onMinify,
  onChange,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [formatStatus, setFormatStatus] = useState<"idle" | "success" | "failed">("idle");
  const [minifyStatus, setMinifyStatus] = useState<"idle" | "success" | "failed">("idle");

  const handleFormat = () => {
    if (!onFormat) return;
    const success = onFormat();
    if (success) {
      setFormatStatus("success");
      setTimeout(() => setFormatStatus("idle"), 1500);
    } else {
      setFormatStatus("failed");
      setTimeout(() => setFormatStatus("idle"), 2000);
    }
  };

  const handleMinify = () => {
    if (!onMinify) return;
    const success = onMinify();
    if (success) {
      setMinifyStatus("success");
      setTimeout(() => setMinifyStatus("idle"), 1500);
    } else {
      setMinifyStatus("failed");
      setTimeout(() => setMinifyStatus("idle"), 2000);
    }
  };

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
            className={`cursor-pointer absolute bottom-3 right-3 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition ${
              repairFailed
                ? "bg-orange-500/90 hover:bg-orange-500 animate-shake"
                : "bg-red-500/90 hover:bg-red-500"
            }`}
          >
            {repairFailed ? "Repair Failed" : "Repair JSON"}
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
        {!hasError && onMinify && value.trim().length > 0 && (
          <button
            type="button"
            onClick={handleMinify}
            className={`cursor-pointer absolute bottom-3 right-[5rem] rounded-lg px-3 py-1.5 text-xs font-medium text-white transition ${
              minifyStatus === "success"
                ? "bg-green-500/90 hover:bg-green-500"
                : minifyStatus === "failed"
                  ? "bg-orange-500/90 hover:bg-orange-500 animate-shake"
                  : "bg-zinc-700 hover:bg-zinc-600"
            }`}
          >
            {minifyStatus === "success"
              ? "Minified!"
              : minifyStatus === "failed"
                ? "Invalid JSON"
                : "Minify"}
          </button>
        )}
        {!hasError && onFormat && value.trim().length > 0 && (
          <button
            type="button"
            onClick={handleFormat}
            className={`cursor-pointer absolute bottom-3 right-3 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition ${
              formatStatus === "success"
                ? "bg-green-500/90 hover:bg-green-500"
                : formatStatus === "failed"
                  ? "bg-orange-500/90 hover:bg-orange-500 animate-shake"
                  : "bg-zinc-700 hover:bg-zinc-600"
            }`}
          >
            {formatStatus === "success"
              ? "Formatted!"
              : formatStatus === "failed"
                ? "Invalid JSON"
                : "Format"}
          </button>
        )}
      </div>
    </div>
  );
}

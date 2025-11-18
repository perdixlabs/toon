type CodeEditorProps = {
  readonly value: string;
  readonly placeholder: string;
  readonly hasError: boolean;
  readonly readOnly?: boolean;
  readonly onRepair?: () => void;
  readonly onCopy?: () => void;
  readonly onChange: (value: string) => void;
};

export function CodeEditor({
  value,
  placeholder,
  hasError,
  readOnly = false,
  onRepair,
  onCopy,
  onChange,
}: CodeEditorProps) {
  return (
    <div className="flex h-full flex-col">
      <div
        className={`flex-1 rounded-2xl border ${
          hasError ? "border-red-400/50" : "border-white/10"
        } bg-black/20 relative`}
      >
        <textarea
          className="h-full w-full resize-none rounded-2xl bg-transparent p-3 font-mono text-sm leading-relaxed text-white outline-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
          placeholder={placeholder}
          spellCheck={false}
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange(event.target.value)}
        />
        {hasError && onRepair && (
          <button
            type="button"
            onClick={onRepair}
            className="absolute bottom-3 right-3 rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-500"
          >
            Repair JSON
          </button>
        )}
        {!hasError && onCopy && value.trim().length > 0 && (
          <button
            type="button"
            onClick={onCopy}
            className="absolute bottom-3 right-3 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
          >
            Copy
          </button>
        )}
      </div>
    </div>
  );
}


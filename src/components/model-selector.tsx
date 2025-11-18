import { modelOptions } from "@/lib/constants";
import type { ModelKey } from "@/lib/types";

type ModelSelectorProps = {
  readonly activeModel: ModelKey;
  readonly onSelect: (model: ModelKey) => void;
};

export function ModelSelector({ activeModel, onSelect }: ModelSelectorProps) {
  return (
    <div className="flex flex-col gap-2 text-white/70">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">Model</p>
      <div className="flex flex-col gap-1">
        {modelOptions.map((model) => (
          <button
            key={model.id}
            type="button"
            onClick={() => onSelect(model.id)}
            className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition hover:bg-white/5 ${
              model.id === activeModel ? "text-white" : "text-white/40"
            }`}
          >
            {model.label}
          </button>
        ))}
      </div>
    </div>
  );
}


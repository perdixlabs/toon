import { Github } from "lucide-react";
import { ModelSelector } from "./model-selector";
import { StatComparison } from "./ui/stat-comparison";
import type { ModelKey } from "@/lib/types";

type SidebarProps = {
  readonly activeModel: ModelKey;
  readonly onModelSelect: (model: ModelKey) => void;
  readonly jsonTokenCount: number;
  readonly jsonCharacterCount: number;
  readonly toonTokenCount: number;
  readonly toonCharacterCount: number;
};

export function Sidebar({
  activeModel,
  onModelSelect,
  jsonTokenCount,
  jsonCharacterCount,
  toonTokenCount,
  toonCharacterCount,
}: SidebarProps) {
  return (
    <aside className="flex h-auto lg:h-full flex-col gap-6 rounded-2xl border border-white/10 bg-[#0D0E12] p-4 shadow-xl shadow-black/30 lg:w-72 shrink-0">
      <div className="flex flex-1 flex-col gap-6 overflow-auto">
        <ModelSelector activeModel={activeModel} onSelect={onModelSelect} />

        <StatComparison
          label="Tokens"
          jsonValue={jsonTokenCount}
          toonValue={toonTokenCount}
        />
        
        <StatComparison
          label="Characters"
          jsonValue={jsonCharacterCount}
          toonValue={toonCharacterCount}
        />
      </div>

      <div className="flex items-center justify-center gap-3">
        <a
          href="https://perdixlabs.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-center text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-white/70 transition hover:text-white"
        >
          Perdix Labs
        </a>
        <a
          href="https://github.com/perdixlabs/toon"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 transition hover:text-white"
          title="View on GitHub"
        >
          <Github className="h-4 w-4" />
        </a>
      </div>
    </aside>
  );
}


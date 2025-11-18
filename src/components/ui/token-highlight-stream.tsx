import { tokenPalette } from "@/lib/constants";
import type { TokenEntry } from "@/lib/types";

type TokenHighlightStreamProps = {
  readonly entries: TokenEntry[];
};

export function TokenHighlightStream({ entries }: TokenHighlightStreamProps) {
  return (
    <div className="text-sm font-mono leading-6 whitespace-pre-wrap">
      {entries.map((entry, index) => (
        <span
          key={entry.key}
          className="text-black"
          style={{
            backgroundColor: tokenPalette[index % tokenPalette.length],
          }}
        >
          {entry.part.length > 0 ? entry.part : "\u00A0"}
        </span>
      ))}
    </div>
  );
}


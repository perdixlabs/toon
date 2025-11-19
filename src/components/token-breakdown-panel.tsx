"use client";

import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { TokenHighlightStream } from "./ui/token-highlight-stream";
import type { TokenEntry, ViewMode } from "@/lib/types";

type TokenBreakdownPanelProps = {
  readonly title: string;
  readonly viewMode: ViewMode;
  readonly onViewModeChange: (mode: ViewMode) => void;
  readonly isCollapsed: boolean;
  readonly onToggleCollapse: () => void;
  readonly error: boolean;
  readonly tokenizerError: string;
  readonly isEmpty: boolean;
  readonly emptyMessage: string;
  readonly tokenEntries: TokenEntry[];
  readonly layoutId: string;
};

export function TokenBreakdownPanel({
  title,
  viewMode,
  onViewModeChange,
  isCollapsed,
  onToggleCollapse,
  error,
  tokenizerError,
  isEmpty,
  emptyMessage,
  tokenEntries,
  layoutId,
}: TokenBreakdownPanelProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 transition-all">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center gap-2 text-sm font-semibold hover:text-white/80 transition-colors"
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              isCollapsed ? "" : "rotate-90"
            }`}
          />
          <span>{title}</span>
        </button>
        {!isCollapsed && (
          <div className="flex items-center gap-2 rounded-full border border-white/10 p-1 text-xs font-medium relative">
          <button
            type="button"
            onClick={() => onViewModeChange("text")}
            className={`flex items-center justify-center rounded-full px-3 py-1 relative z-10 transition-colors w-20 ${
              viewMode === "text" ? "text-black" : "text-white/70"
            }`}
          >
            Text
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("ids")}
            className={`flex items-center justify-center rounded-full px-3 py-1 relative z-10 transition-colors w-20 ${
              viewMode === "ids" ? "text-black" : "text-white/70"
            }`}
          >
            ID
          </button>
          {viewMode === "text" && (
            <motion.div
              layoutId={layoutId}
              className="absolute inset-y-1 rounded-full bg-white"
              style={{
                left: "0.25rem",
                width: "calc(50% - 0.375rem)",
              }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            />
          )}
          {viewMode === "ids" && (
            <motion.div
              layoutId={layoutId}
              className="absolute inset-y-1 rounded-full bg-white"
              style={{
                left: "calc(50% + 0.125rem)",
                width: "calc(50% - 0.375rem)",
              }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            />
          )}
          </div>
        )}
      </div>
      {!isCollapsed && (
        <div className="mt-3 flex-1 rounded-2xl border border-white/10 bg-black/50 p-3 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
          {isEmpty && <p className="text-sm text-white/60">{emptyMessage}</p>}
          {!isEmpty && error && (
            <p className="text-sm text-white/60">
              Fix JSON syntax to view tokens.
            </p>
          )}
          {!isEmpty && !error && tokenizerError && (
            <p className="text-sm text-red-400">{tokenizerError}</p>
          )}
          {!isEmpty && !error && !tokenizerError && (
            <>
              {viewMode === "text" ? (
                <TokenHighlightStream entries={tokenEntries} />
              ) : (
                <div className="flex flex-wrap gap-2 text-sm font-mono text-white/80">
                  {tokenEntries.map((entry) => (
                    <span
                      key={entry.key}
                      className="rounded-lg border border-white/20 px-2 py-1"
                    >
                      {entry.id}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}


"use client";

import { decode as decodeToon, encode as encodeToon } from "@toon-format/toon";
import { jsonrepair } from "jsonrepair";
import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { CodeEditor } from "@/components/code-editor";
import { TokenBreakdownPanel } from "@/components/token-breakdown-panel";
import { exampleJson, modelOptions, tokenizers } from "@/lib/constants";
import type { ModelKey, SyncSource, TokenEntry, ViewMode } from "@/lib/types";

export default function Home() {
  const [activeModel, setActiveModel] = useState<ModelKey>("gpt-4o");
  const [jsonInput, setJsonInput] = useState(exampleJson);
  const [toonInput, setToonInput] = useState("");
  const [inputViewMode, setInputViewMode] = useState<ViewMode>("text");
  const [outputViewMode, setOutputViewMode] = useState<ViewMode>("text");
  const [syncSource, setSyncSource] = useState<SyncSource>("json");
  const [jsonError, setJsonError] = useState(false);
  const [jsonPanelCollapsed, setJsonPanelCollapsed] = useState(false);
  const [toonPanelCollapsed, setToonPanelCollapsed] = useState(false);

  useEffect(() => {
    if (syncSource !== "json") return;

    if (!jsonInput.trim()) {
      setToonInput("");
      setJsonError(false);
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const toon = encodeToon(parsed).trimEnd();
      setToonInput(toon);
      setJsonError(false);
    } catch (error) {
      setJsonError(true);
    }
  }, [jsonInput, syncSource]);

  const jsonTokenSnapshot = useMemo(() => {
    if (!jsonInput.trim()) {
      return { ids: [] as number[], parts: [] as string[], error: "" };
    }

    try {
      const tokenizer = tokenizers[activeModel];
      const ids = tokenizer.encode(jsonInput);
      const parts = ids.map((id) => tokenizer.decode([id]));
      return { ids, parts, error: "" };
    } catch (error) {
      return {
        ids: [],
        parts: [],
        error:
          error instanceof Error
            ? error.message
            : "Unable to tokenize JSON for this model.",
      };
    }
  }, [activeModel, jsonInput]);

  const toonTokenSnapshot = useMemo(() => {
    if (!toonInput.trim()) {
      return { ids: [] as number[], parts: [] as string[], error: "" };
    }

    try {
      const tokenizer = tokenizers[activeModel];
      const ids = tokenizer.encode(toonInput);
      const parts = ids.map((id) => tokenizer.decode([id]));
      return { ids, parts, error: "" };
    } catch (error) {
      return {
        ids: [],
        parts: [],
        error:
          error instanceof Error
            ? error.message
            : "Unable to tokenize output for this model.",
      };
    }
  }, [activeModel, toonInput]);

  const jsonTokenEntries: TokenEntry[] = useMemo(() => {
    if (jsonTokenSnapshot.ids.length === 0) {
      return [];
    }

    return jsonTokenSnapshot.ids.map((id, index) => ({
      id,
      part: jsonTokenSnapshot.parts[index] ?? "",
      key: `json-${id}-${jsonTokenSnapshot.parts[index] ?? ""}-${index}`,
    }));
  }, [jsonTokenSnapshot]);

  const toonTokenEntries: TokenEntry[] = useMemo(() => {
    if (toonTokenSnapshot.ids.length === 0) {
      return [];
    }

    return toonTokenSnapshot.ids.map((id, index) => ({
      id,
      part: toonTokenSnapshot.parts[index] ?? "",
      key: `toon-${id}-${toonTokenSnapshot.parts[index] ?? ""}-${index}`,
    }));
  }, [toonTokenSnapshot]);

  const activeTab =
    modelOptions.find((model) => model.id === activeModel) ?? modelOptions[0];
  const jsonCharacterCount = jsonInput.length;
  const jsonTokenCount = jsonTokenEntries.length;
  const toonCharacterCount = toonInput.length;
  const toonTokenCount = toonTokenEntries.length;

  const handleRepairJson = () => {
    try {
      const repaired = jsonrepair(jsonInput);
      setJsonInput(repaired);
      setSyncSource("json");
    } catch (error) {
      // If repair fails, just keep the original input
      console.error("Failed to repair JSON:", error);
    }
  };

  const handleCopyToon = async () => {
    try {
      await navigator.clipboard.writeText(toonInput);
    } catch (error) {
      console.error("Failed to copy TOON:", error);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#050505] text-white">
      <main className="mx-auto flex h-auto w-full flex-col gap-4 p-5 lg:h-full lg:flex-row">
        <Sidebar
          activeModel={activeModel}
          onModelSelect={(model) => setActiveModel(model)}
          jsonTokenCount={jsonTokenCount}
          jsonCharacterCount={jsonCharacterCount}
          toonTokenCount={toonTokenCount}
          toonCharacterCount={toonCharacterCount}
        />

        <div className="flex flex-1 flex-col gap-4 lg:overflow-hidden">
          <div className="grid flex-1 gap-4 lg:min-h-0 lg:grid-cols-2">
            <section className="flex h-auto lg:min-h-0 flex-col gap-3 rounded-2xl border border-white/10 bg-[#0D0E12] p-4 lg:overflow-hidden">
              <div className="flex items-center justify-between shrink-0 h-8">
                <div className="flex items-center gap-2">
                  <img
                    src="/json.png"
                    alt="JSON"
                    width={20}
                    height={20}
                    className="opacity-60"
                  />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                    JSON
                  </h2>
                </div>
                {jsonInput.trim().length > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSyncSource("json");
                      setJsonInput("");
                    }}
                    className="cursor-pointer rounded-lg border border-white/15 px-3 py-1 text-xs text-white/80 transition hover:bg-white/10"
                  >
                    Clear
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSyncSource("json");
                      setJsonInput(exampleJson);
                    }}
                    className="cursor-pointer rounded-lg border border-white/15 px-3 py-1 text-xs text-white/80 transition hover:bg-white/10"
                  >
                    Load example
                  </button>
                )}
              </div>
              <div className="h-[500px] lg:flex-1 lg:h-0 lg:overflow-hidden">
                <CodeEditor
                  value={jsonInput}
                  placeholder='{"messages": [...]}'
                  hasError={jsonError}
                  onRepair={handleRepairJson}
                  onChange={(value) => {
                    setSyncSource("json");
                    setJsonInput(value);
                  }}
                />
              </div>
              <div
                className={
                  jsonPanelCollapsed
                    ? "h-auto shrink-0"
                    : "h-[500px] lg:flex-1 lg:h-0 lg:overflow-hidden"
                }
              >
                <TokenBreakdownPanel
                  title="Token Breakdown"
                  viewMode={inputViewMode}
                  onViewModeChange={setInputViewMode}
                  isCollapsed={jsonPanelCollapsed}
                  onToggleCollapse={() => setJsonPanelCollapsed(!jsonPanelCollapsed)}
                  error={jsonError}
                  tokenizerError={jsonTokenSnapshot.error}
                  isEmpty={jsonInput.length === 0}
                  emptyMessage="Provide JSON to view token breakdown for this model."
                  tokenEntries={jsonTokenEntries}
                  layoutId="json-tab-indicator"
                />
              </div>
            </section>

            <section className="flex h-auto lg:min-h-0 flex-col gap-3 rounded-2xl border border-white/10 bg-[#0D0E12] p-4 lg:overflow-hidden">
              <div className="flex items-center justify-between shrink-0 h-8">
                <div className="flex items-center gap-2">
                  <img
                    src="/toon.png"
                    alt="TOON"
                    width={20}
                    height={20}
                    className="opacity-60"
                  />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                    TOON
                  </h2>
                </div>
              </div>
              <div className="h-[500px] lg:flex-1 lg:h-0 lg:overflow-hidden">
                <CodeEditor
                  value={toonInput}
                  placeholder="TOON output will appear here once your JSON parses."
                  hasError={false}
                  readOnly={true}
                  language="toon"
                  onCopy={handleCopyToon}
                  onChange={() => {}}
                />
              </div>
              <div
                className={
                  toonPanelCollapsed
                    ? "h-auto shrink-0"
                    : "h-[500px] lg:flex-1 lg:h-0 lg:overflow-hidden"
                }
              >
                <TokenBreakdownPanel
                  title="Token Breakdown"
                  viewMode={outputViewMode}
                  onViewModeChange={setOutputViewMode}
                  isCollapsed={toonPanelCollapsed}
                  onToggleCollapse={() => setToonPanelCollapsed(!toonPanelCollapsed)}
                  error={false}
                  tokenizerError={toonTokenSnapshot.error}
                  isEmpty={toonInput.length === 0}
                  emptyMessage="Provide JSON to materialize TOON output and tokens."
                  tokenEntries={toonTokenEntries}
                  layoutId="toon-tab-indicator"
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

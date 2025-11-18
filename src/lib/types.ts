export type ModelKey = "gpt-4o" | "gpt-4" | "gpt-3";

export type ModelOption = {
  id: ModelKey;
  label: string;
  summary: string;
  contextWindow: string;
};

export type TokenizerAPI = {
  encode: (text: string) => number[];
  decode: (tokens: number[] | Uint32Array) => string;
};

export type TokenEntry = {
  id: number;
  part: string;
  key: string;
};

export type ViewMode = "text" | "ids";

export type SyncSource = "json" | "toon";


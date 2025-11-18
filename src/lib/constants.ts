import * as gpt3Tokenizer from "gpt-tokenizer/model/text-davinci-003";
import * as gpt4Tokenizer from "gpt-tokenizer/model/gpt-4-turbo";
import * as gpt4oTokenizer from "gpt-tokenizer/model/gpt-4o";
import type { ModelKey, ModelOption, TokenizerAPI } from "./types";

export const modelOptions: ModelOption[] = [
  {
    id: "gpt-4o",
    label: "GPT-4o & GPT-4o mini",
    summary: "Fast multimodal models powered by o200k_base tokenizer.",
    contextWindow: "128K context window",
  },
  {
    id: "gpt-4",
    label: "GPT-3.5 & GPT-4",
    summary: "Classic chat models (cl100k_base).",
    contextWindow: "32K context window",
  },
  {
    id: "gpt-3",
    label: "GPT-3 (Legacy)",
    summary: "Davinci-style legacy completion models.",
    contextWindow: "4K context window",
  },
];

export const tokenizers: Record<ModelKey, TokenizerAPI> = {
  "gpt-4o": {
    encode: gpt4oTokenizer.encode,
    decode: gpt4oTokenizer.decode,
  },
  "gpt-4": {
    encode: gpt4Tokenizer.encode,
    decode: gpt4Tokenizer.decode,
  },
  "gpt-3": {
    encode: gpt3Tokenizer.encode,
    decode: gpt3Tokenizer.decode,
  },
};

export const tokenPalette = [
  "#8E7CFF",
  "#63A3FF",
  "#45C5B0",
  "#F2A93B",
  "#F472B6",
  "#C084FC",
  "#38BDF8",
  "#34D399",
];

export const examplePayload = {
  prompt:
    "OpenAI's large language models process text using tokens, which are common sequences of characters found in a set of text.",
  metadata: {
    createdBy: "perdixlabs",
    intent: "token-visualizer",
    version: "1.0.0",
  },
  instructions: [
    {
      role: "system",
      content:
        "Explain how the model uses tokens to predict the next chunk of text.",
    },
    {
      role: "user",
      content:
        "Use concise wording and capture the spirit of the OpenAI tokenizer playground UI.",
    },
  ],
};

export const exampleJson = JSON.stringify(examplePayload, null, 2);


import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const colors = {
  background: "transparent",
  foreground: "#d4d4d4",
  selection: "#264f78",
  cursor: "#ffffff",
  activeLine: "transparent",

  string: "#ce9178",
  number: "#b5cea8",
  boolean: "#569cd6",
  null: "#569cd6",
  property: "#9cdcfe",
  bracket: "#ffd700",
  punctuation: "#d4d4d4",
  comment: "#6a9955",
};

export const editorTheme = EditorView.theme({
  "&": {
    backgroundColor: colors.background,
    color: colors.foreground,
    height: "100%",
  },
  ".cm-content": {
    fontFamily:
      "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
    fontSize: "14px",
    lineHeight: "1.625",
    padding: "12px",
    caretColor: colors.cursor,
  },
  ".cm-cursor": {
    borderLeftColor: colors.cursor,
    borderLeftWidth: "2px",
  },
  ".cm-selectionBackground": {
    backgroundColor: colors.selection,
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: colors.selection,
  },
  ".cm-activeLine": {
    backgroundColor: colors.activeLine,
  },
  ".cm-gutters": {
    display: "none",
  },
  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "inherit",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-placeholder": {
    color: "#6b7280",
    fontStyle: "normal",
  },
});

export const highlightStyle = HighlightStyle.define([
  { tag: tags.string, color: colors.string },
  { tag: tags.number, color: colors.number },
  { tag: tags.bool, color: colors.boolean },
  { tag: tags.null, color: colors.null },
  { tag: tags.propertyName, color: colors.property },
  { tag: tags.punctuation, color: colors.punctuation },
  { tag: tags.bracket, color: colors.bracket },
  { tag: tags.brace, color: colors.bracket },
  { tag: tags.squareBracket, color: colors.bracket },
  { tag: tags.comment, color: colors.comment },
  { tag: tags.keyword, color: colors.boolean },
  { tag: tags.name, color: colors.property },
]);

export const vsCodeTheme = [editorTheme, syntaxHighlighting(highlightStyle)];

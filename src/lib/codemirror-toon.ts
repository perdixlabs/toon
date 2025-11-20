import {
  LanguageSupport,
  StreamLanguage,
  StringStream,
} from "@codemirror/language";

const toonLanguage = StreamLanguage.define({
  token(stream: StringStream): string | null {
    if (stream.sol() && stream.eatSpace()) {
      return null;
    }

    if (stream.match(/^#.*/)) {
      return "comment";
    }

    if (stream.match(/^\[\d+\]/)) {
      return "bracket";
    }

    if (stream.match(/^\{[^}]*\}/)) {
      return "meta";
    }

    if (stream.match(/^(true|false)(?=[\s,\n]|$)/)) {
      return "bool";
    }

    if (stream.match(/^null(?=[\s,\n]|$)/)) {
      return "null";
    }

    if (stream.match(/^-?\d+\.?\d*(?=[\s,\n]|$)/)) {
      return "number";
    }

    if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*(?=\s*[\[{:])/)) {
      return "propertyName";
    }

    if (stream.eat(":")) {
      return "punctuation";
    }

    if (stream.eat(",")) {
      return "punctuation";
    }

    if (stream.match(/^[\[\]{}]/)) {
      return "bracket";
    }

    if (stream.match(/^"(?:[^"\\]|\\.)*"/)) {
      return "string";
    }
    if (stream.match(/^'(?:[^'\\]|\\.)*'/)) {
      return "string";
    }

    if (stream.match(/^[^\s,:\[\]{}]+/)) {
      return "string";
    }

    stream.next();
    return null;
  },
});

export function toon(): LanguageSupport {
  return new LanguageSupport(toonLanguage);
}

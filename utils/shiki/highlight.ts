import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import {
  type HighlighterCore,
  type RegexEngine,
  createHighlighterCore,
} from "shiki/core";

// Themes:
import lightTheme from "@shikijs/themes/one-light";
import darkTheme from "@shikijs/themes/one-dark-pro";

// Languages:
import html from "@shikijs/langs/html";
import js from "@shikijs/langs/js";
import ts from "@shikijs/langs/ts";
import tsx from "@shikijs/langs/tsx";
import css from "@shikijs/langs/css";
import json from "@shikijs/langs/json";
import bash from "@shikijs/langs/bash";
import markdown from "@shikijs/langs/mdx";

let jsEngine: RegexEngine | null = null;
let highlighter: Promise<HighlighterCore> | null = null;

// Settings for UI components
const Themes = {
  light: "one-light",
  dark: "one-dark-pro",
};

type Languages = "html" | "js" | "ts" | "tsx" | "css" | "bash" | "json" | "mdx";

const getJsEngine = (): RegexEngine => {
  jsEngine ??= createJavaScriptRegexEngine();
  return jsEngine;
};

const highlight = async (): Promise<HighlighterCore> => {
  highlighter ??= createHighlighterCore({
    themes: [lightTheme, darkTheme],
    langs: [bash, js, ts, tsx, css, markdown, html, json],
    engine: getJsEngine(),
  });
  return highlighter;
};

export { highlight, Themes, type Languages };

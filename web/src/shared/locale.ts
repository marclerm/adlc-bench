import { es, type EnglishMessage } from "./translations";
import { uiEs } from "./uiTranslations";

export type Locale = "en" | "es";

const KEY = "bench.locale";
const originals = new WeakMap<Node, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const attributes = ["aria-label", "placeholder", "title"];
let observer: MutationObserver | undefined;

function translated(value: string): string {
  if (value in es) return es[value as EnglishMessage];
  if (value in uiEs) return uiEs[value];
  const prefix = [
    ["Edit ", "Editar "],
    ["Delete ", "Eliminar "],
    ["Open ", "Abrir "],
    ["Expand ", "Expandir "],
    ["Collapse ", "Contraer "],
    ["Rename ", "Renombrar "],
    ["Search ", "Buscar "],
    ["Remove ", "Quitar "],
    ["Add ", "Añadir "],
  ].find(([english]) => value.startsWith(english));
  return prefix ? prefix[1] + value.slice(prefix[0].length) : value;
}

function translateText(node: Text, restore = false): void {
  const value = node.data;
  const trimmed = value.trim();
  if (!trimmed) return;
  if (currentLocale() === "en") {
    const original = originals.get(node);
    if (restore && original && value !== original) node.data = original;
    else originals.set(node, value);
    return;
  }
  const saved = originals.get(node);
  if (saved?.replace(saved.trim(), translated(saved.trim())) !== value) {
    originals.set(node, value);
  }
  const original = originals.get(node)!;
  const source = original.trim();
  const next = original.replace(source, translated(source));
  if (node.data !== next) node.data = next;
}

function translateElement(element: Element, restore = false): void {
  let saved = originalAttributes.get(element);
  if (!saved) {
    saved = new Map();
    originalAttributes.set(element, saved);
  }
  for (const name of attributes) {
    const value = element.getAttribute(name);
    if (value === null) continue;
    const previous = saved.get(name);
    if (
      !previous ||
      (!restore && value !== translated(previous) && value !== previous)
    ) {
      saved.set(name, value);
    }
    const original = saved.get(name)!;
    const next = currentLocale() === "es" ? translated(original) : original;
    if (value !== next) element.setAttribute(name, next);
  }
}

function translateTree(root: Node, restore = false): void {
  if (root instanceof Text) translateText(root, restore);
  if (root instanceof Element) translateElement(root, restore);
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
  );
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node instanceof Text) translateText(node, restore);
    else translateElement(node as Element, restore);
  }
}

export function currentLocale(): Locale {
  return document.documentElement.lang === "es" ? "es" : "en";
}

export function initLocale(): void {
  const stored = localStorage.getItem(KEY);
  document.documentElement.lang = stored === "es" ? "es" : "en";
  observer ??= new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) translateTree(node);
      if (record.type === "characterData" || record.type === "attributes")
        translateTree(record.target);
    }
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: attributes,
  });
}

export function setLocale(locale: Locale): void {
  localStorage.setItem(KEY, locale);
  document.documentElement.lang = locale;
  translateTree(document.body, locale === "en");
}

export function t(message: EnglishMessage): string {
  return currentLocale() === "es" ? es[message] : message;
}

export function localeCode(): "en-US" | "es-US" {
  return currentLocale() === "es" ? "es-US" : "en-US";
}

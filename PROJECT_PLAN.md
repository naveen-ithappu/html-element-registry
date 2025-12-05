# Project Plan: html-element-registry

## 1. Project Overview
* **Name:** `html-element-registry`
* **Goal:** A lightweight, type-safe npm library containing a scraped database of all standard HTML elements.
* **Source of Truth:** MDN Web Docs (Reference pages and Content Categories).
* **Core Value:** Provides both legacy "Display" types (Block/Inline) and strict HTML5 "Content Categories" (Flow, Phrasing, Interactive).

## 2. Directory Structure

html-element-registry/
├── .github/
│   └── workflows/
│       └── scrape.yml        # Automates weekly updates
├── src/
│   ├── data/
│   │   └── elements.json     # The generated database (Do not edit manually)
│   ├── index.ts              # Main library export
│   └── types.ts              # TypeScript definitions
├── scripts/
│   └── scrape.ts             # The scraping logic
├── tests/
│   └── index.test.ts         # Unit tests
├── package.json
├── tsconfig.json
└── tsup.config.ts            # Bundler config

## 3. The Data Structure (JSON)

The output `src/data/elements.json` will use the tag name as the key.

{
  "div": {
    "tag": "div",
    "description": "The generic container for flow content.",
    "display": "block",
    "categories": ["flow content", "palpable content"],
    "isVoid": false
  },
  "span": {
    "tag": "span",
    "description": "A generic inline container for phrasing content.",
    "display": "inline",
    "categories": ["flow content", "phrasing content"],
    "isVoid": false
  }
}

## 4. Implementation Logic

### A. The Scraper (scripts/scrape.ts)
Use a **Hybrid Two-Pass Strategy**.

**Pass 1: Broad Classification**
* **Source:** `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements`
* **Action:** Fetch page. Map `h2` section headers to "Display" types.
    * "Inline text semantics" -> `inline`
    * "Content sectioning" -> `block`
    * "Text content" -> `block`
    * "Document metadata" -> `meta`
* **Output:** Temporary list of tags with descriptions and display types.

**Pass 2: Semantic Depth**
* **Action:** Loop through the list. Visit specific element URLs (e.g., `.../Element/video`).
* **Action:** Extract "Content categories" from the intro text or technical summary box.
* **Concurrency:** Use `p-limit` (max 5 concurrent requests) to avoid IP bans.

### B. The Library API (src/index.ts)

import elements from './data/elements.json';

// 1. Direct Access
export const allElements = elements;
export function getElement(tagName: string) {
  return elements[tagName.toLowerCase()] || null;
}

// 2. Legacy Helper Checkers
export const isBlock = (tag: string) => getElement(tag)?.display === 'block';
export const isInline = (tag: string) => getElement(tag)?.display === 'inline';

// 3. Semantic Helper Checkers
export const isFlowContent = (tag: string) => getElement(tag)?.categories.includes('flow content');
export const isPhrasingContent = (tag: string) => getElement(tag)?.categories.includes('phrasing content');
export const isInteractive = (tag: string) => getElement(tag)?.categories.includes('interactive content');

// 4. Void Tag Checker
const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
export const isVoid = (tag: string) => VOID_TAGS.has(tag.toLowerCase());

## 5. Development Steps (Prompt for AI Editor)

**Step 1: Setup**
> "Initialize a new Node project named `html-element-registry`. Install `tsup`, `vitest`, `axios`, `cheerio`, `p-limit`, `zod`, and `typescript`. Configure `tsconfig.json` for a modern library outputting to ESNext."

**Step 2: Scraper**
> "Create `scripts/scrape.ts`. Write a script using `axios` and `cheerio` to fetch the MDN HTML elements reference page. Parse the headers to determine element display types (block/inline) based on the section they are in. Log the results."

**Step 3: Detail Scraping**
> "Extend the scraper to visit the individual link for each element found. Extract the 'Content categories' section. Use `p-limit` to handle requests. Save the final JSON to `src/data/elements.json`."

**Step 4: Library**
> "Create `src/index.ts`. Export the functions `getElement`, `isBlock`, `isInline`, `isVoid`, and `isPhrasingContent`. Ensure strict TypeScript types."
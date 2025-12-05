import axios from 'axios';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { HtmlElementRegistry, ElementType, ElementSummary } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MDN_ELEMENTS_URL = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements';


const SECTION_DISPLAY_MAP: Record<string, ElementType> = {
  "Main root": "root",
  "Document metadata": "meta",
  "Sectioning root": "body",
  "Content sectioning": "block",
  "Text content": "block",
  "Inline text semantics": "inline",
  "Image and multimedia": "multimedia",
  "Embedded content": "block",
  "SVG and MathML": "block",
  "Scripting": "script",
  "Demarcating edits": "block",
  "Table content": "table",
  "Forms": "form",
  "Interactive elements": "block",
  "Web Components": "block",
  "Obsolete and deprecated elements": "block"
};

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

async function fetchIndexPage(): Promise<string> {
  const res = await axios.get<string>(MDN_ELEMENTS_URL, { responseType: 'text' });
  return res.data;
}

function extractSectionKey(text: string): string | null {
  const key = text.trim();
  for (const section of Object.keys(SECTION_DISPLAY_MAP)) {
    if (key.startsWith(section)) return section;
  }
  return null;
}

function parseIndexPage(html: string): HtmlElementRegistry {
  const $ = cheerio.load(html);
  const elements: HtmlElementRegistry = new Map();

  $('.reference-layout__body section.content-section').each((_: number, sectionEl: any) => {
    const section = $(sectionEl as any);

    const heading = section.find('h2').first();
    const headingText = heading.text();
    const linkTitle = heading.find('a').first().text().trim();
    const sectionTitle:string = (linkTitle || headingText).trim();
    const sectionKey = extractSectionKey(headingText);
    if (!sectionKey) return;

    const elementType = SECTION_DISPLAY_MAP[sectionKey];

    const table = section.find('figure.table-container table').first();
    if (!table.length) return;

    table.find('tbody tr').each((__idx: number, rowEl: any) => {
      const row = $(rowEl as any);
      const cells = row.find('td');
      if (cells.length < 2) return;

      const elementCell = $(cells[0]);
      const descCell = $(cells[1]);

      const link = elementCell.find('a[href*="/Web/HTML/Reference/Elements/"]').first();
      if (!link.length) return;

      const href = link.attr('href');
      if (!href) return;

      const url = href.startsWith('http') ? href : `https://developer.mozilla.org${href}`;

      const rawTagText = link.text().trim() || elementCell.text().trim();
      if (!rawTagText) return;

      const tag = rawTagText.replace(/[<>]/g, '').toLowerCase();
      if (!tag) return;

      const description = descCell.text().trim();

      const entry: ElementSummary = elements.get(tag) || {
        tag,
        description,
        type: elementType,
        url,
        category: sectionTitle,
        isVoid: VOID_TAGS.has(tag)
      };
      entry.category = sectionTitle;
      elements.set(tag, entry);
    });
  });

  return elements;
}

async function main() {
  // TODO: Implement the two-pass scraping strategy described in PROJECT_PLAN.md
  console.log('Fetching MDN index page:', MDN_ELEMENTS_URL);

  const indexHtml = await fetchIndexPage();
  const registry = parseIndexPage(indexHtml);
  //console.log(`Discovered ${registry.size} elements from index.`);


  // const registry: HtmlElementRegistry = {};

  // for (const summary of summaries) {
  //   const record: HtmlElementRecord = {
  //     ...summary,
  //     isVoid: VOID_TAGS.has(summary.tag),
  //   };
  //   registry[summary.tag] = record;
  // }


  const outPath = path.resolve(__dirname, '../src/data/elements.json');
  await writeFile(outPath, JSON.stringify(Object.fromEntries(registry.entries()), null, 2), 'utf8');
  console.log('Wrote elements registry to', outPath);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

# html-element-registry

> A lightweight, type-safe npm library containing a scraped database of all standard HTML elements.

[![npm version](https://img.shields.io/npm/v/html-element-registry.svg)](https://www.npmjs.com/package/html-element-registry)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- 📦 **Comprehensive Database** - All standard HTML elements scraped from MDN Web Docs
- 🔍 **Type-Safe** - Full TypeScript support with detailed type definitions
- 🎯 **Element Classification** - Query elements by type (block, inline, table, form, etc.)
- 🏷️ **Category Support** - Access MDN content categories for each element
- ⚡ **Zero Runtime Dependencies** - Pure data, no external runtime dependencies
- 🔒 **Immutable** - All returned data is immutable to prevent accidental mutations
- 🤖 **Auto-Updated** - Weekly automated scraping keeps data fresh

## Installation

```bash
npm install html-element-registry
```

```bash
yarn add html-element-registry
```

```bash
pnpm add html-element-registry
```

## Usage

### Basic Element Lookup

```typescript
import { getElement } from 'html-element-registry';

const div = getElement('div');
console.log(div);
// {
//   tag: 'div',
//   description: 'The generic container for flow content.',
//   type: 'block',
//   category: 'Text content',
//   url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div',
//   isVoid: false
// }
```

### Type Checking

```typescript
import { isBlock, isInline, isVoid, isForm } from 'html-element-registry';

isBlock('div');        // true
isInline('span');      // true
isVoid('img');         // true
isForm('input');       // true
```

### Filter by Type or Category

```typescript
import { getElementsByType, getElementsByCategory } from 'html-element-registry';

// Get all form elements
const formElements = getElementsByType('form');
// [{ tag: 'button', ... }, { tag: 'input', ... }, ...]

// Get all elements in "Text content" category
const textElements = getElementsByCategory('Text content');
// [{ tag: 'div', ... }, { tag: 'p', ... }, ...]
```

### Get Metadata

```typescript
import { getAllCategories, getAllTypes, getVoidElements } from 'html-element-registry';

// Get all unique categories
const categories = getAllCategories();
// ['Main root', 'Document metadata', 'Content sectioning', ...]

// Get all element types
const types = getAllTypes();
// ['block', 'inline', 'meta', 'table', 'form', ...]

// Get all void (self-closing) elements
const voidElements = getVoidElements();
// [{ tag: 'br', ... }, { tag: 'img', ... }, ...]
```

## API Reference

### Element Lookup

- **`getElement(tagName: string): ElementSummary | null`**  
  Get an element by its tag name (case-insensitive). Returns a copy to prevent mutation.

### Type Checkers

- **`isElementType(tag: string, type: ElementType): boolean`**  
  Check if an element matches a specific type.

- **`isBlock(tag: string): boolean`**  
  Check if element is block-level.

- **`isInline(tag: string): boolean`**  
  Check if element is inline.

- **`isMeta(tag: string): boolean`**  
  Check if element is metadata.

- **`isTable(tag: string): boolean`**  
  Check if element is table-related.

- **`isForm(tag: string): boolean`**  
  Check if element is form-related.

- **`isMultimedia(tag: string): boolean`**  
  Check if element is multimedia.

- **`isScript(tag: string): boolean`**  
  Check if element is script-related.

- **`isVoid(tag: string): boolean`**  
  Check if element is void (self-closing).

### Filters

- **`getElementsByCategory(category: string): ElementSummary[]`**  
  Get all elements in a specific category (case-insensitive).

- **`getElementsByType(type: ElementType): ElementSummary[]`**  
  Get all elements of a specific type.

- **`getVoidElements(): ElementSummary[]`**  
  Get all void elements.

### Metadata

- **`getAllCategories(): string[]`**  
  Get list of all unique categories.

- **`getAllTypes(): ElementType[]`**  
  Get list of all unique element types.

## TypeScript Types

```typescript
export type ElementType = 
  | 'block' 
  | 'inline' 
  | 'meta' 
  | 'root' 
  | 'body' 
  | 'multimedia' 
  | 'script' 
  | 'table' 
  | 'form';

export type ElementSummary = {
  tag: string;
  description: string;
  url: string;
  category: string;
  type: ElementType;
  isVoid: boolean;
};
```

## Data Source

All element data is scraped from [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements), the authoritative source for web standards documentation.

The scraper runs weekly via GitHub Actions to keep the data up-to-date with the latest HTML specifications.

## Development

```bash
# Install dependencies
npm install

# Run the scraper
npm run scrape

# Build the library
npm run build

# Run tests
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [html-element-registry contributors](LICENSE)

## Acknowledgments

- Data sourced from [MDN Web Docs](https://developer.mozilla.org/)
- Built with [TypeScript](https://www.typescriptlang.org/)
- Bundled with [tsup](https://tsup.egoist.dev/)

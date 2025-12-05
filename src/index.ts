import elementsJson from './data/elements.json';
import type { ElementSummary, ElementType, ElementsRecord } from './types';

// Cast JSON to proper type
const elementsMap = elementsJson as unknown as ElementsRecord;

// Helper to create immutable copy of an element
function cloneElement(element: ElementSummary): ElementSummary {
  return { ...element };
}

// ============================================================================
// Element Lookup
// ============================================================================

/**
 * Get an element by its tag name.
 * @param tagName - The HTML tag name (case-insensitive)
 * @returns A copy of the element summary or null if not found
 */
export function getElement(tagName: string): ElementSummary | null {
  const element = elementsMap[tagName.toLowerCase()];
  return element ? cloneElement(element) : null;
}

// ============================================================================
// Type Checkers
// ============================================================================

/**
 * Check if an element is of a specific type.
 * @param tag - The HTML tag name
 * @param type - The element type to check
 * @returns True if the element matches the type
 */
export function isElementType(tag: string, type: ElementType): boolean {
  return getElement(tag)?.type === type;
}

/**
 * Check if an element is a block-level element.
 * @param tag - The HTML tag name
 * @returns True if the element is block-level
 */
export function isBlock(tag: string): boolean {
  return getElement(tag)?.type === 'block';
}

/**
 * Check if an element is an inline element.
 * @param tag - The HTML tag name
 * @returns True if the element is inline
 */
export function isInline(tag: string): boolean {
  return getElement(tag)?.type === 'inline';
}

/**
 * Check if an element is a metadata element.
 * @param tag - The HTML tag name
 * @returns True if the element is metadata
 */
export function isMeta(tag: string): boolean {
  return getElement(tag)?.type === 'meta';
}

/**
 * Check if an element is a table-related element.
 * @param tag - The HTML tag name
 * @returns True if the element is table-related
 */
export function isTable(tag: string): boolean {
  return getElement(tag)?.type === 'table';
}

/**
 * Check if an element is a form-related element.
 * @param tag - The HTML tag name
 * @returns True if the element is form-related
 */
export function isForm(tag: string): boolean {
  return getElement(tag)?.type === 'form';
}

/**
 * Check if an element is a multimedia element.
 * @param tag - The HTML tag name
 * @returns True if the element is multimedia
 */
export function isMultimedia(tag: string): boolean {
  return getElement(tag)?.type === 'multimedia';
}

/**
 * Check if an element is a script-related element.
 * @param tag - The HTML tag name
 * @returns True if the element is script-related
 */
export function isScript(tag: string): boolean {
  return getElement(tag)?.type === 'script';
}

// ============================================================================
// Void Tag Checker
// ============================================================================

/**
 * Check if an element is a void element (self-closing, no closing tag).
 * @param tag - The HTML tag name
 * @returns True if the element is void
 */
export function isVoid(tag: string): boolean {
  return getElement(tag)?.isVoid ?? false;
}

// ============================================================================
// Category Filters
// ============================================================================

/**
 * Get all elements in a specific category.
 * @param category - The category name (case-insensitive)
 * @returns Array of element copies in that category
 */
export function getElementsByCategory(category: string): ElementSummary[] {
  const lowerCategory = category.toLowerCase();
  const results: ElementSummary[] = [];
  for (const element of Object.values(elementsMap)) {
    if (element.category.toLowerCase() === lowerCategory) {
      results.push(cloneElement(element));
    }
  }
  return results;
}

/**
 * Get all elements of a specific type.
 * @param type - The element type
 * @returns Array of element copies of that type
 */
export function getElementsByType(type: ElementType): ElementSummary[] {
  const results: ElementSummary[] = [];
  for (const element of Object.values(elementsMap)) {
    if (element.type === type) {
      results.push(cloneElement(element));
    }
  }
  return results;
}

/**
 * Get all void elements.
 * @returns Array of void element copies
 */
export function getVoidElements(): ElementSummary[] {
  const results: ElementSummary[] = [];
  for (const element of Object.values(elementsMap)) {
    if (element.isVoid) {
      results.push(cloneElement(element));
    }
  }
  return results;
}

/**
 * Get all categories.
 * @returns Array of unique category names
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  for (const element of Object.values(elementsMap)) {
    categories.add(element.category);
  }
  return Array.from(categories).sort();
}

/**
 * Get all element types.
 * @returns Array of unique element types
 */
export function getAllTypes(): ElementType[] {
  const types = new Set<ElementType>();
  for (const element of Object.values(elementsMap)) {
    types.add(element.type);
  }
  return Array.from(types).sort();
}

// ============================================================================
// Re-export types
// ============================================================================

export type { ElementSummary, ElementType } from './types';

import { describe, it, expect } from 'vitest';
import {
  getElement,
  isBlock,
  isInline,
  isMeta,
  isTable,
  isForm,
  isMultimedia,
  isScript,
  isVoid,
  isElementType,
  getElementsByCategory,
  getElementsByType,
  getVoidElements,
  getAllCategories,
  getAllTypes,
  type ElementSummary,
  type ElementType
} from '../src/index';

describe('html-element-registry', () => {
  describe('getElement', () => {
    it('returns element data for valid tag', () => {
      const div = getElement('div');
      expect(div).toBeTruthy();
      expect(div?.tag).toBe('div');
      expect(div?.type).toBe('block');
      expect(div?.isVoid).toBe(false);
    });

    it('is case-insensitive', () => {
      const div1 = getElement('div');
      const div2 = getElement('DIV');
      expect(div1).toEqual(div2);
    });

    it('returns null for invalid tag', () => {
      const invalid = getElement('notarealtag');
      expect(invalid).toBeNull();
    });

    it('returns immutable copy', () => {
      const div1 = getElement('div');
      const div2 = getElement('div');
      expect(div1).not.toBe(div2);
      expect(div1).toEqual(div2);
    });
  });

  describe('type checkers', () => {
    it('isBlock identifies block elements', () => {
      expect(isBlock('div')).toBe(true);
      expect(isBlock('p')).toBe(true);
      expect(isBlock('span')).toBe(false);
    });

    it('isInline identifies inline elements', () => {
      expect(isInline('span')).toBe(true);
      expect(isInline('a')).toBe(true);
      expect(isInline('div')).toBe(false);
    });

    it('isMeta identifies metadata elements', () => {
      expect(isMeta('meta')).toBe(true);
      expect(isMeta('link')).toBe(true);
      expect(isMeta('div')).toBe(false);
    });

    it('isTable identifies table elements', () => {
      expect(isTable('table')).toBe(true);
      expect(isTable('tr')).toBe(true);
      expect(isTable('div')).toBe(false);
    });

    it('isForm identifies form elements', () => {
      expect(isForm('input')).toBe(true);
      expect(isForm('button')).toBe(true);
      expect(isForm('div')).toBe(false);
    });

    it('isMultimedia identifies multimedia elements', () => {
      expect(isMultimedia('video')).toBe(true);
      expect(isMultimedia('audio')).toBe(true);
      expect(isMultimedia('div')).toBe(false);
    });

    it('isScript identifies script elements', () => {
      expect(isScript('script')).toBe(true);
      expect(isScript('div')).toBe(false);
    });

    it('isElementType checks specific type', () => {
      expect(isElementType('div', 'block')).toBe(true);
      expect(isElementType('span', 'inline')).toBe(true);
      expect(isElementType('div', 'inline')).toBe(false);
    });
  });

  describe('void element checker', () => {
    it('isVoid identifies void elements', () => {
      expect(isVoid('br')).toBe(true);
      expect(isVoid('img')).toBe(true);
      expect(isVoid('input')).toBe(true);
      expect(isVoid('hr')).toBe(true);
    });

    it('isVoid returns false for non-void elements', () => {
      expect(isVoid('div')).toBe(false);
      expect(isVoid('span')).toBe(false);
      expect(isVoid('p')).toBe(false);
    });

    it('isVoid returns false for invalid tags', () => {
      expect(isVoid('notarealtag')).toBe(false);
    });
  });

  describe('category filters', () => {
    it('getElementsByCategory returns elements in category', () => {
      const textContent = getElementsByCategory('Text content');
      expect(textContent.length).toBeGreaterThan(0);
      expect(textContent.every(el => el.category === 'Text content')).toBe(true);
    });

    it('getElementsByCategory is case-insensitive', () => {
      const result1 = getElementsByCategory('Text content');
      const result2 = getElementsByCategory('text content');
      expect(result1).toEqual(result2);
    });

    it('getElementsByCategory returns empty array for invalid category', () => {
      const invalid = getElementsByCategory('NotARealCategory');
      expect(invalid).toEqual([]);
    });

    it('getElementsByCategory returns immutable copies', () => {
      const result1 = getElementsByCategory('Text content');
      const result2 = getElementsByCategory('Text content');
      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });
  });

  describe('type filters', () => {
    it('getElementsByType returns elements of type', () => {
      const blocks = getElementsByType('block');
      expect(blocks.length).toBeGreaterThan(0);
      expect(blocks.every(el => el.type === 'block')).toBe(true);
    });

    it('getVoidElements returns all void elements', () => {
      const voids = getVoidElements();
      expect(voids.length).toBeGreaterThan(0);
      expect(voids.every(el => el.isVoid === true)).toBe(true);
    });
  });

  describe('metadata functions', () => {
    it('getAllCategories returns unique categories', () => {
      const categories = getAllCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(new Set(categories).size).toBe(categories.length);
      expect(categories).toEqual([...categories].sort());
    });

    it('getAllTypes returns unique types', () => {
      const types = getAllTypes();
      expect(types.length).toBeGreaterThan(0);
      expect(new Set(types).size).toBe(types.length);
      expect(types).toEqual([...types].sort());
    });
  });
});

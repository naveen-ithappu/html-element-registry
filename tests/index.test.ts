import { describe, it, expect } from 'vitest';
import { allElements, getElement, isBlock, isInline, isVoid, isPhrasingContent } from '../src/index';

describe('html-element-registry API surface', () => {
  it('exposes the expected functions', () => {
    expect(allElements).toBeTypeOf('object');
    expect(getElement).toBeTypeOf('function');
    expect(isBlock).toBeTypeOf('function');
    expect(isInline).toBeTypeOf('function');
    expect(isVoid).toBeTypeOf('function');
    expect(isPhrasingContent).toBeTypeOf('function');
  });
});

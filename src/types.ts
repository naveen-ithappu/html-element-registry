export type ElementType = 'block' | 'inline' | 'meta' | 'root' | 'body' | 'multimedia' | 'script' | 'table' | 'form';

export type ElementSummary = {
  tag: string;
  description: string;
  url: string;
  category: string
  type: ElementType,
  isVoid: boolean;
};

export type HtmlElementRegistry = Map<string, ElementSummary>;
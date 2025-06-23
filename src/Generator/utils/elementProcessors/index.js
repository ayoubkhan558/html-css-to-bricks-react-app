export * from './formProcessor';
export * from './listProcessor';
export * from './textProcessor';
export * from './mediaProcessor';
export * from './tableProcessor';

export const ELEMENT_PROCESSORS = {
  // Form elements
  form: processFormElement,
  input: processFormFieldElement,
  select: processFormFieldElement,
  textarea: processFormFieldElement,
  button: processFormFieldElement,
  
  // List elements
  ul: processListElement,
  ol: processListElement,
  li: processListItemElement,
  
  // Text elements
  h1: processTextElement,
  h2: processTextElement,
  h3: processTextElement,
  h4: processTextElement,
  h5: processTextElement,
  h6: processTextElement,
  p: processTextElement,
  span: processTextElement,
  address: processTextElement,
  time: processTextElement,
  mark: processTextElement,
  blockquote: processTextElement,
  pre: processTextElement,
  code: processTextElement,
  a: processLinkElement,
  
  // Media elements
  img: processImageElement,
  video: processVideoElement,
  audio: processAudioElement,
  svg: processSvgElement,
  
  // Table elements
  table: processTableElement,
  thead: processTableElement,
  tbody: processTableElement,
  tfoot: processTableElement,
  tr: processTableElement,
  th: processTableElement,
  td: processTableElement
};

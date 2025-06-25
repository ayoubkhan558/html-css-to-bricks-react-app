import { getUniqueId } from '../utils';
import {
  processTextNode as processTextNodeModule,
  processTextElement as processTextElementModule
} from './text';

// Re-export the functions from the text module
export const processTextNode = processTextNodeModule;
export const processTextElement = processTextElementModule;

// This file is maintained for backward compatibility
// New code should import directly from './text' instead

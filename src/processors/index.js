/**
 * Processors Index
 * Registers all processors and exports registry
 */

import { processorRegistry } from './ProcessorRegistry';
import { HeadingProcessor } from './HeadingProcessor';
import { TextProcessor } from './TextProcessor';
import { ButtonProcessor } from './ButtonProcessor';
import { ImageProcessor } from './ImageProcessor';
import { DivProcessor } from './DivProcessor';

// Initialize processors
const headingProcessor = new HeadingProcessor();
const textProcessor = new TextProcessor();
const buttonProcessor = new ButtonProcessor();
const imageProcessor = new ImageProcessor();
const divProcessor = new DivProcessor();

// Register processors
processorRegistry.register(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], headingProcessor);
processorRegistry.register(['p', 'span', 'blockquote', 'address', 'time', 'mark'], textProcessor);
processorRegistry.register('button', buttonProcessor);
processorRegistry.register('img', imageProcessor);

// Set default processor for unregistered tags
processorRegistry.setDefault(divProcessor);

// Export registry and processors
export { processorRegistry };
export { BaseProcessor } from './BaseProcessor';
export { ProcessorRegistry } from './ProcessorRegistry';
export { HeadingProcessor } from './HeadingProcessor';
export { TextProcessor } from './TextProcessor';
export { ButtonProcessor } from './ButtonProcessor';
export { ImageProcessor } from './ImageProcessor';
export { DivProcessor } from './DivProcessor';

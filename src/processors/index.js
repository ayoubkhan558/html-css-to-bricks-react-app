/**
 * Processors Index
 * Registers all processors and exports registry
 */

import { processorRegistry } from './ProcessorRegistry';
import { HeadingProcessor } from './HeadingProcessor';
import { TextProcessor } from './TextProcessor';
import { ButtonProcessor } from './ButtonProcessor';
import { ImageProcessor } from './ImageProcessor';
import { LinkProcessor } from './LinkProcessor';
import { ListProcessor } from './ListProcessor';
import { TableProcessor } from './TableProcessor';
import { SvgProcessor } from './SvgProcessor';
import { VideoProcessor } from './VideoProcessor';
import { AudioProcessor } from './AudioProcessor';
import { DivProcessor } from './DivProcessor';

// Initialize processors
const headingProcessor = new HeadingProcessor();
const textProcessor = new TextProcessor();
const buttonProcessor = new ButtonProcessor();
const imageProcessor = new ImageProcessor();
const linkProcessor = new LinkProcessor();
const listProcessor = new ListProcessor();
const tableProcessor = new TableProcessor();
const svgProcessor = new SvgProcessor();
const videoProcessor = new VideoProcessor();
const audioProcessor = new AudioProcessor();
const divProcessor = new DivProcessor();

// Register processors by tag
processorRegistry.register(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], headingProcessor);
processorRegistry.register(['p', 'span', 'blockquote', 'address', 'time', 'mark'], textProcessor);
processorRegistry.register('button', buttonProcessor);
processorRegistry.register('img', imageProcessor);
processorRegistry.register('a', linkProcessor);
processorRegistry.register(['ul', 'ol', 'li'], listProcessor);
processorRegistry.register(['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td'], tableProcessor);
processorRegistry.register('svg', svgProcessor);
processorRegistry.register('video', videoProcessor);
processorRegistry.register('audio', audioProcessor);

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
export { LinkProcessor } from './LinkProcessor';
export { ListProcessor } from './ListProcessor';
export { TableProcessor } from './TableProcessor';
export { SvgProcessor } from './SvgProcessor';
export { VideoProcessor } from './VideoProcessor';
export { AudioProcessor } from './AudioProcessor';
export { DivProcessor } from './DivProcessor';

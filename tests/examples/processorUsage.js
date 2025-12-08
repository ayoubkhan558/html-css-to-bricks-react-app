/**
 * Example Usage of Processor Registry
 */

import { processorRegistry } from '../processors';
import { BaseProcessor } from '../processors/BaseProcessor';

// ============================================
// Example 1: Using the Registry
// ============================================

export function processWithRegistryExample() {
    const html = '<h1>Hello World</h1>';
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const h1 = doc.querySelector('h1');

    // Get processor for the element
    const processor = processorRegistry.getProcessor('h1');

    // Process the element
    const bricksElement = processor.process(h1, { parentId: '0' });

    console.log('Processed:', bricksElement);
    return bricksElement;
}

// ============================================
// Example 2: Creating a Custom Processor
// ============================================

class VideoProcessor extends BaseProcessor {
    process(node, context = {}) {
        const element = this.createElement(node, context);

        element.name = 'video';
        element.label = this.getElementLabel(node, 'Video', context);
        element.settings.videoUrl = this.getAttribute(node, 'src', '');
        element.settings.autoplay = this.getAttribute(node, 'autoplay') !== null;
        element.settings.loop = this.getAttribute(node, 'loop') !== null;

        return element;
    }

    canProcess(node) {
        return node.tagName?.toLowerCase() === 'video';
    }
}

// ============================================
// Example 3: Registering Custom Processor
// ============================================

export function registerCustomProcessor() {
    const videoProcessor = new VideoProcessor();
    processorRegistry.register('video', videoProcessor);

    console.log('Registered video processor');
    console.log('All registered tags:', processorRegistry.getRegisteredTags());
}

// ============================================
// Example 4: Processing Different Elements
// ============================================

export function processMultipleElements() {
    const html = `
    <div>
      <h1>Title</h1>
      <p>Paragraph</p>
      <button>Click me</button>
      <img src="image.jpg" alt="Image">
    </div>
  `;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.body.querySelectorAll('h1, p, button, img');

    const results = Array.from(elements).map(node => {
        const tag = node.tagName.toLowerCase();
        const processor = processorRegistry.getProcessor(tag);
        return processor.process(node, { parentId: '0' });
    });

    console.log('Processed elements:', results);
    return results;
}

// ============================================
// Example 5: Checking Processor Availability
// ============================================

export function checkProcessorAvailability() {
    const tags = ['h1', 'p', 'button', 'video', 'custom-element'];

    tags.forEach(tag => {
        const hasProcessor = processorRegistry.hasProcessor(tag);
        const processor = processorRegistry.getProcessor(tag);

        console.log(`${tag}: ${hasProcessor ? 'Registered' : 'Using default'} (${processor.getName()})`);
    });
}

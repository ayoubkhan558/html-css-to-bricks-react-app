/**
 * Simple Tests for Element Processing
 * Tests the actual processor functions from the consolidated processors directory
 */

import { describe, it, expect } from 'vitest';
import { converterService } from '../src/services/converter';

// HEADING PROCESSING
describe('Heading Processing', () => {
    it('should convert h1 to heading element', () => {
        const result = converterService.convert('<h1>Title</h1>', '');
        const h1 = result.content[0];

        expect(h1.name).toBe('heading');
        expect(h1.settings.tag).toBe('h1');
        expect(h1.settings.text).toBe('Title');
    });

    it('should handle h1 through h6', () => {
        const result = converterService.convert('<h3>Subtitle</h3>', '');
        const h3 = result.content[0];

        expect(h3.name).toBe('heading');
        expect(h3.settings.tag).toBe('h3');
    });
});

// TEXT PROCESSING
describe('Text Processing', () => {
    it('should convert paragraph to text-basic', () => {
        const result = converterService.convert('<p>Text content</p>', '');
        const p = result.content[0];

        expect(p.name).toBe('text');
        expect(p.settings.tag).toBe('p');
    });
});

// BUTTON PROCESSING
describe('Button Processing', () => {
    it('should convert button element', () => {
        const result = converterService.convert('<button>Click Me</button>', '');
        const btn = result.content[0];

        expect(btn.name).toBe('button');
        expect(btn.settings.text).toBeDefined();
    });

    it('should handle disabled button', () => {
        const result = converterService.convert('<button disabled>Disabled</button>', '');
        const btn = result.content[0];

        expect(btn.name).toBe('button');
    });
});

// DIV PROCESSING
describe('Div Processing', () => {
    it('should convert div element', () => {
        const result = converterService.convert('<div>Content</div>', '');
        const div = result.content[0];

        expect(div.name).toBe('div');
        expect(div.parent).toBe('0');
    });

    it('should preserve div classes', () => {
        const result = converterService.convert('<div class="container main">Content</div>', '');

        expect(result.globalClasses.length).toBeGreaterThan(0);
        expect(result.globalClasses.some(c => c.name === 'container')).toBe(true);
    });
});

// IMAGE PROCESSING
describe('Image Processing', () => {
    it('should convert img element', () => {
        const result = converterService.convert('<img src="test.jpg" alt="Test">', '');
        const img = result.content[0];

        expect(img.name).toBe('image');
    });
});

// LINK PROCESSING
describe('Link Processing', () => {
    it('should convert anchor element', () => {
        const result = converterService.convert('<a href="https://example.com">Link</a>', '');
        const link = result.content[0];

        expect(link.settings.link).toBeDefined();
        expect(link.settings.link.url).toBe('https://example.com');
    });
});

// LIST PROCESSING
describe('List Processing', () => {
    it('should convert unordered list', () => {
        const result = converterService.convert('<ul><li>Item 1</li><li>Item 2</li></ul>', '');

        expect(result.content.length).toBeGreaterThan(0);
    });
});

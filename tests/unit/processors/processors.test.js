/**
 * Processor Registry Unit Tests
 * 
 * This file tests the processor system which handles converting different
 * HTML elements into Bricks elements. Each HTML tag (h1, p, button, etc.)
 * has its own processor that knows how to convert it.
 * 
 * What we're testing:
 * - BaseProcessor: Abstract base class that all processors extend
 * - ProcessorRegistry: Manages all processors and routes elements to them
 * - Individual Processors: HeadingProcessor, TextProcessor, ButtonProcessor, etc.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ProcessorRegistry } from '../../../src/processors/ProcessorRegistry';
import { BaseProcessor } from '../../../src/processors/BaseProcessor';
import { HeadingProcessor } from '../../../src/processors/HeadingProcessor';
import { TextProcessor } from '../../../src/processors/TextProcessor';
import { ButtonProcessor } from '../../../src/processors/ButtonProcessor';
import { DivProcessor } from '../../../src/processors/DivProcessor';
import { createElementFromHTML } from '../../helpers/fixtures';
import { assertBricksElement, assertElementSettings } from '../../helpers/assertions';

// ========================================
// BASE PROCESSOR TESTS
// ========================================
describe('BaseProcessor', () => {
    // Test: BaseProcessor is abstract - can't be instantiated directly
    it('should throw error when instantiated directly', () => {
        expect(() => new BaseProcessor()).toThrow('BaseProcessor is abstract');
    });

    // Test: Subclasses must implement process() method
    it('should throw error when process() not implemented', () => {
        // Create a processor that doesn't implement process()
        class TestProcessor extends BaseProcessor { }
        const processor = new TestProcessor();

        // Calling process() should throw an error
        expect(() => processor.process(null)).toThrow('process() must be implemented');
    });
});

// ========================================
// PROCESSOR REGISTRY TESTS
// ========================================
describe('ProcessorRegistry', () => {
    let registry;

    // Setup: Create a fresh registry before each test
    beforeEach(() => {
        registry = new ProcessorRegistry();
    });

    describe('register()', () => {
        // Test: Can we register a processor for a single tag?
        it('should register processor for single tag', () => {
            const processor = new HeadingProcessor();
            registry.register('h1', processor);

            // Registry should now have a processor for h1
            expect(registry.hasProcessor('h1')).toBe(true);
            expect(registry.getProcessor('h1')).toBe(processor);
        });

        // Test: Can we register one processor for multiple tags?
        it('should register processor for multiple tags', () => {
            const processor = new HeadingProcessor();

            // Register for h1, h2, and h3 all at once
            registry.register(['h1', 'h2', 'h3'], processor);

            // All three should now have the same processor
            expect(registry.hasProcessor('h1')).toBe(true);
            expect(registry.hasProcessor('h2')).toBe(true);
            expect(registry.hasProcessor('h3')).toBe(true);
            expect(registry.getProcessor('h1')).toBe(processor);
        });

        // Test: Does it reject invalid processors?
        it('should throw error for non-BaseProcessor', () => {
            // Try to register a plain object (not a BaseProcessor)
            expect(() => registry.register('div', {})).toThrow('must extend BaseProcessor');
        });
    });

    describe('setDefault()', () => {
        // Test: Can we set a default processor for unknown tags?
        it('should set default processor', () => {
            const defaultProc = new DivProcessor();
            registry.setDefault(defaultProc);

            // Unknown tags should get the default processor
            expect(registry.getProcessor('unknown-tag')).toBe(defaultProc);
        });
    });

    describe('getProcessor()', () => {
        // Test: Does it return the correct processor?
        it('should return registered processor', () => {
            const processor = new ButtonProcessor();
            registry.register('button', processor);

            expect(registry.getProcessor('button')).toBe(processor);
        });

        // Test: Does it return default for unregistered tags?
        it('should return default for unregistered tag', () => {
            const defaultProc = new DivProcessor();
            registry.setDefault(defaultProc);

            expect(registry.getProcessor('unknown')).toBe(defaultProc);
        });

        // Test: Is tag matching case-insensitive?
        it('should be case-insensitive', () => {
            const processor = new ButtonProcessor();
            registry.register('BUTTON', processor);

            // All these should work
            expect(registry.getProcessor('button')).toBe(processor);
            expect(registry.getProcessor('Button')).toBe(processor);
            expect(registry.getProcessor('BUTTON')).toBe(processor);
        });
    });

    describe('size()', () => {
        // Test: Does it count registered processors correctly?
        it('should return number of registered processors', () => {
            registry.register('h1', new HeadingProcessor());
            registry.register(['p', 'span'], new TextProcessor());

            // Should have 3 total (h1, p, span)
            expect(registry.size()).toBe(3);
        });
    });

    describe('clear()', () => {
        // Test: Can we clear all registrations?
        it('should clear all registrations', () => {
            registry.register('h1', new HeadingProcessor());
            registry.setDefault(new DivProcessor());

            registry.clear();

            // Everything should be gone
            expect(registry.size()).toBe(0);
            expect(registry.getProcessor('h1')).toBeNull();
        });
    });
});

// ========================================
// HEADING PROCESSOR TESTS
// ========================================
describe('HeadingProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new HeadingProcessor();
    });

    // Test: Can we process an h1 element?
    it('should process h1 element', () => {
        const h1 = createElementFromHTML('<h1>Test Heading</h1>');
        const result = processor.process(h1, { parentId: '0' });

        // Should create a heading element
        assertBricksElement(result);
        expect(result.name).toBe('heading');

        // Should preserve the tag and text
        assertElementSettings(result, {
            tag: 'h1',
            text: 'Test Heading'
        });
    });

    // Test: Does it set the skipTextNodes flag?
    it('should set skipTextNodes flag', () => {
        const h2 = createElementFromHTML('<h2>Title</h2>');
        const result = processor.process(h2);

        // Headings should skip processing their text nodes separately
        expect(result._skipTextNodes).toBe(true);
    });

    // Test: Does it only accept h1-h6 tags?
    it('should only accept h1-h6 tags', () => {
        expect(processor.canProcess({ tagName: 'H1' })).toBe(true);
        expect(processor.canProcess({ tagName: 'H6' })).toBe(true);
        expect(processor.canProcess({ tagName: 'DIV' })).toBe(false);
    });

    // Test: Does it handle different heading levels?
    it('should handle all heading levels (h1-h6)', () => {
        for (let i = 1; i <= 6; i++) {
            const heading = createElementFromHTML(`<h${i}>Heading ${i}</h${i}>`);
            const result = processor.process(heading);

            expect(result.name).toBe('heading');
            expect(result.settings.tag).toBe(`h${i}`);
            expect(result.settings.text).toBe(`Heading ${i}`);
        }
    });
});

// ========================================
// TEXT PROCESSOR TESTS
// ========================================
describe('TextProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new TextProcessor();
    });

    // Test: Can we process a paragraph?
    it('should process paragraph element', () => {
        const p = createElementFromHTML('<p>Test paragraph</p>');
        const result = processor.process(p);

        assertBricksElement(result);
        expect(result.name).toBe('text-basic');

        assertElementSettings(result, {
            tag: 'p',
            text: 'Test paragraph'
        });
    });

    // Test: Does it handle span elements?
    it('should process span element', () => {
        const span = createElementFromHTML('<span>Span text</span>');
        const result = processor.process(span);

        expect(result.name).toBe('text-basic');
        expect(result.settings.tag).toBe('span');
    });

    // Test: Does it use custom tag for blockquote?
    it('should use custom tag for blockquote', () => {
        const bq = createElementFromHTML('<blockquote>Quote</blockquote>');
        const result = processor.process(bq);

        // Blockquote should use custom tag
        expect(result.settings.tag).toBe('custom');
        expect(result.settings.customTag).toBe('blockquote');
    });

    // Test: Does it handle all supported text tags?
    it('should handle all text element types', () => {
        const tags = ['p', 'span', 'blockquote', 'address', 'time', 'mark'];

        tags.forEach(tag => {
            const element = createElementFromHTML(`<${tag}>Text</${tag}>`);
            const result = processor.process(element);

            expect(result.name).toBe('text-basic');
            expect(processor.canProcess({ tagName: tag.toUpperCase() })).toBe(true);
        });
    });
});

// ========================================
// BUTTON PROCESSOR TESTS
// ========================================
describe('ButtonProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new ButtonProcessor();
    });

    // Test: Can we process a button?
    it('should process button element', () => {
        const btn = createElementFromHTML('<button>Click me</button>');
        const result = processor.process(btn);

        assertBricksElement(result);
        expect(result.name).toBe('button');

        assertElementSettings(result, {
            text: 'Click me',
            style: 'primary'
        });
    });

    // Test: Does it handle disabled attribute?
    it('should handle disabled attribute', () => {
        const btn = createElementFromHTML('<button disabled>Disabled</button>');
        const result = processor.process(btn);

        expect(result.settings.disabled).toBe(true);
    });

    // Test: Does it handle type attribute?
    it('should preserve button type', () => {
        const btn = createElementFromHTML('<button type="submit">Submit</button>');
        const result = processor.process(btn);

        expect(result.settings.type).toBe('submit');
    });

    // Test: Does it handle empty button?
    it('should handle button without text', () => {
        const btn = createElementFromHTML('<button></button>');
        const result = processor.process(btn);

        expect(result.name).toBe('button');
        expect(result.settings.text).toBe('');
    });
});

// ========================================
// DIV PROCESSOR TESTS
// ========================================
describe('DivProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new DivProcessor();
    });

    // Test: Can we process a div?
    it('should process div element', () => {
        const div = createElementFromHTML('<div>Content</div>');
        const result = processor.process(div, { parentId: '0' });

        assertBricksElement(result);
        expect(result.name).toBe('div');
        expect(result.parent).toBe('0');
    });

    // Test: Does it handle nested divs?
    it('should handle nested structure', () => {
        const div = createElementFromHTML(`
      <div class="outer">
        <div class="inner">Content</div>
      </div>
    `);

        const result = processor.process(div);

        expect(result.name).toBe('div');
        expect(result.children).toBeDefined();
    });

    // Test: Can it serve as default processor?
    it('should work as default processor for unknown tags', () => {
        // DivProcessor is often used as the default for unknown elements
        const custom = createElementFromHTML('<custom-element>Test</custom-element>');
        const result = processor.process(custom);

        // Should still create a valid Bricks element
        assertBricksElement(result);
    });
});

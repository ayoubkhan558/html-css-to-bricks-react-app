/**
 * Simplified Processor Tests
 * Tests the processor system for converting HTML elements
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ProcessorRegistry } from '../../../src/processors/ProcessorRegistry';
import { BaseProcessor } from '../../../src/processors/BaseProcessor';
import { HeadingProcessor } from '../../../src/processors/HeadingProcessor';
import { TextProcessor } from '../../../src/processors/TextProcessor';
import { ButtonProcessor } from '../../../src/processors/ButtonProcessor';
import { DivProcessor } from '../../../src/processors/DivProcessor';
import { createElementFromHTML } from '../../helpers/fixtures';

// BASE PROCESSOR
describe('BaseProcessor', () => {
    it('should throw error when instantiated directly', () => {
        expect(() => new BaseProcessor()).toThrow();
    });

    it('should throw error when process() not implemented', () => {
        class TestProcessor extends BaseProcessor { }
        const processor = new TestProcessor();
        expect(() => processor.process(null)).toThrow();
    });
});

// PROCESSOR REGISTRY
describe('ProcessorRegistry', () => {
    let registry;

    beforeEach(() => {
        registry = new ProcessorRegistry();
    });

    it('should register processor for single tag', () => {
        const processor = new HeadingProcessor();
        registry.register('h1', processor);

        expect(registry.hasProcessor('h1')).toBe(true);
    });

    it('should register processor for multiple tags', () => {
        const processor = new HeadingProcessor();
        registry.register(['h1', 'h2', 'h3'], processor);

        expect(registry.hasProcessor('h1')).toBe(true);
        expect(registry.hasProcessor('h2')).toBe(true);
        expect(registry.hasProcessor('h3')).toBe(true);
    });

    it('should set default processor', () => {
        const defaultProc = new DivProcessor();
        registry.setDefault(defaultProc);

        expect(registry.getProcessor('unknown-tag')).toBe(defaultProc);
    });

    it('should be case-insensitive', () => {
        const processor = new ButtonProcessor();
        registry.register('BUTTON', processor);

        expect(registry.getProcessor('button')).toBe(processor);
    });

    it('should return correct size', () => {
        registry.register('h1', new HeadingProcessor());
        registry.register(['p', 'span'], new TextProcessor());

        expect(registry.size()).toBe(3);
    });

    it('should clear all registrations', () => {
        registry.register('h1', new HeadingProcessor());
        registry.clear();

        expect(registry.size()).toBe(0);
    });
});

// HEADING PROCESSOR
describe('HeadingProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new HeadingProcessor();
    });

    it('should process h1 element', () => {
        const h1 = createElementFromHTML('<h1>Test Heading</h1>');
        const result = processor.process(h1, { parentId: '0' });

        expect(result.name).toBe('heading');
        expect(result.settings.tag).toBe('h1');
        expect(result.settings.text).toBe('Test Heading');
    });

    it('should handle all heading levels', () => {
        for (let i = 1; i <= 6; i++) {
            const heading = createElementFromHTML(`<h${i}>Heading ${i}</h${i}>`);
            const result = processor.process(heading);

            expect(result.name).toBe('heading');
            expect(result.settings.tag).toBe(`h${i}`);
        }
    });
});

// TEXT PROCESSOR
describe('TextProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new TextProcessor();
    });

    it('should process paragraph element', () => {
        const p = createElementFromHTML('<p>Test paragraph</p>');
        const result = processor.process(p);

        expect(result.name).toBe('text-basic');
        expect(result.settings.tag).toBe('p');
    });

    it('should handle span element', () => {
        const span = createElementFromHTML('<span>Span text</span>');
        const result = processor.process(span);

        expect(result.name).toBe('text-basic');
    });
});

// BUTTON PROCESSOR
describe('ButtonProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new ButtonProcessor();
    });

    it('should process button element', () => {
        const btn = createElementFromHTML('<button>Click me</button>');
        const result = processor.process(btn);

        expect(result.name).toBe('button');
        expect(result.settings.text).toBeDefined();
    });

    it('should handle button type', () => {
        const btn = createElementFromHTML('<button type="submit">Submit</button>');
        const result = processor.process(btn);

        expect(result.name).toBe('button');
    });
});

// DIV PROCESSOR
describe('DivProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new DivProcessor();
    });

    it('should process div element', () => {
        const div = createElementFromHTML('<div>Content</div>');
        const result = processor.process(div, { parentId: '0' });

        expect(result.name).toBe('div');
        expect(result.parent).toBe('0');
    });

    it('should handle nested divs', () => {
        const div = createElementFromHTML('<div class="outer"><div class="inner">Content</div></div>');
        const result = processor.process(div);

        expect(result.name).toBe('div');
        expect(result.children).toBeDefined();
    });
});

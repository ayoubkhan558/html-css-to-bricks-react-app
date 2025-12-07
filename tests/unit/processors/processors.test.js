/**
 * Unit Tests for Processor Registry
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ProcessorRegistry } from '../processors/ProcessorRegistry';
import { BaseProcessor } from '../processors/BaseProcessor';
import { HeadingProcessor } from '../processors/HeadingProcessor';
import { TextProcessor } from '../processors/TextProcessor';
import { ButtonProcessor } from '../processors/ButtonProcessor';
import { DivProcessor } from '../processors/DivProcessor';

describe('BaseProcessor', () => {
    it('should throw error when instantiated directly', () => {
        expect(() => new BaseProcessor()).toThrow('BaseProcessor is abstract');
    });

    it('should throw error when process() not implemented', () => {
        class TestProcessor extends BaseProcessor { }
        const processor = new TestProcessor();
        expect(() => processor.process(null)).toThrow('process() must be implemented');
    });
});

describe('ProcessorRegistry', () => {
    let registry;

    beforeEach(() => {
        registry = new ProcessorRegistry();
    });

    describe('register()', () => {
        it('should register processor for single tag', () => {
            const processor = new HeadingProcessor();
            registry.register('h1', processor);

            expect(registry.hasProcessor('h1')).toBe(true);
            expect(registry.getProcessor('h1')).toBe(processor);
        });

        it('should register processor for multiple tags', () => {
            const processor = new HeadingProcessor();
            registry.register(['h1', 'h2', 'h3'], processor);

            expect(registry.hasProcessor('h1')).toBe(true);
            expect(registry.hasProcessor('h2')).toBe(true);
            expect(registry.hasProcessor('h3')).toBe(true);
        });

        it('should throw error for non-BaseProcessor', () => {
            expect(() => registry.register('div', {})).toThrow('must extend BaseProcessor');
        });
    });

    describe('setDefault()', () => {
        it('should set default processor', () => {
            const defaultProc = new DivProcessor();
            registry.setDefault(defaultProc);

            expect(registry.getProcessor('unknown-tag')).toBe(defaultProc);
        });
    });

    describe('getProcessor()', () => {
        it('should return registered processor', () => {
            const processor = new ButtonProcessor();
            registry.register('button', processor);

            expect(registry.getProcessor('button')).toBe(processor);
        });

        it('should return default for unregistered tag', () => {
            const defaultProc = new DivProcessor();
            registry.setDefault(defaultProc);

            expect(registry.getProcessor('unknown')).toBe(defaultProc);
        });

        it('should be case-insensitive', () => {
            const processor = new ButtonProcessor();
            registry.register('BUTTON', processor);

            expect(registry.getProcessor('button')).toBe(processor);
            expect(registry.getProcessor('Button')).toBe(processor);
        });
    });

    describe('size()', () => {
        it('should return number of registered processors', () => {
            registry.register('h1', new HeadingProcessor());
            registry.register(['p', 'span'], new TextProcessor());

            expect(registry.size()).toBe(3);
        });
    });

    describe('clear()', () => {
        it('should clear all registrations', () => {
            registry.register('h1', new HeadingProcessor());
            registry.setDefault(new DivProcessor());

            registry.clear();

            expect(registry.size()).toBe(0);
            expect(registry.getProcessor('h1')).toBeNull();
        });
    });
});

describe('HeadingProcessor', () => {
    let processor;
    let parser;

    beforeEach(() => {
        processor = new HeadingProcessor();
        parser = new DOMParser();
    });

    it('should process h1 element', () => {
        const doc = parser.parseFromString('<h1>Test Heading</h1>', 'text/html');
        const h1 = doc.querySelector('h1');

        const result = processor.process(h1, { parentId: '0' });

        expect(result.name).toBe('heading');
        expect(result.settings.tag).toBe('h1');
        expect(result.settings.text).toBe('Test Heading');
    });

    it('should set skipTextNodes flag', () => {
        const doc = parser.parseFromString('<h2>Title</h2>', 'text/html');
        const h2 = doc.querySelector('h2');

        const result = processor.process(h2);

        expect(result._skipTextNodes).toBe(true);
    });

    it('should only accept h1-h6 tags', () => {
        expect(processor.canProcess({ tagName: 'H1' })).toBe(true);
        expect(processor.canProcess({ tagName: 'H6' })).toBe(true);
        expect(processor.canProcess({ tagName: 'DIV' })).toBe(false);
    });
});

describe('TextProcessor', () => {
    let processor;
    let parser;

    beforeEach(() => {
        processor = new TextProcessor();
        parser = new DOMParser();
    });

    it('should process paragraph element', () => {
        const doc = parser.parseFromString('<p>Test paragraph</p>', 'text/html');
        const p = doc.querySelector('p');

        const result = processor.process(p);

        expect(result.name).toBe('text-basic');
        expect(result.settings.tag).toBe('p');
        expect(result.settings.text).toBe('Test paragraph');
    });

    it('should use custom tag for blockquote', () => {
        const doc = parser.parseFromString('<blockquote>Quote</blockquote>', 'text/html');
        const bq = doc.querySelector('blockquote');

        const result = processor.process(bq);

        expect(result.settings.tag).toBe('custom');
        expect(result.settings.customTag).toBe('blockquote');
    });
});

describe('ButtonProcessor', () => {
    let processor;
    let parser;

    beforeEach(() => {
        processor = new ButtonProcessor();
        parser = new DOMParser();
    });

    it('should process button element', () => {
        const doc = parser.parseFromString('<button>Click me</button>', 'text/html');
        const btn = doc.querySelector('button');

        const result = processor.process(btn);

        expect(result.name).toBe('button');
        expect(result.settings.text).toBe('Click me');
        expect(result.settings.style).toBe('primary');
    });

    it('should handle disabled attribute', () => {
        const doc = parser.parseFromString('<button disabled>Disabled</button>', 'text/html');
        const btn = doc.querySelector('button');

        const result = processor.process(btn);

        expect(result.settings.disabled).toBe(true);
    });
});

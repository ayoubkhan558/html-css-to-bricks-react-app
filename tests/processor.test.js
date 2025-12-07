/**
 * Simple Tests for Processors
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ProcessorRegistry } from '../src/processors/ProcessorRegistry';
import { BaseProcessor } from '../src/processors/BaseProcessor';
import { HeadingProcessor } from '../src/processors/HeadingProcessor';
import { TextProcessor } from '../src/processors/TextProcessor';
import { ButtonProcessor } from '../src/processors/ButtonProcessor';
import { DivProcessor } from '../src/processors/DivProcessor';
import { html } from './helpers';

// BASE PROCESSOR
describe('BaseProcessor', () => {
    it('should throw error when created directly', () => {
        expect(() => new BaseProcessor()).toThrow();
    });
});

// PROCESSOR REGISTRY
describe('ProcessorRegistry', () => {
    let registry;

    beforeEach(() => {
        registry = new ProcessorRegistry();
    });

    it('should register processor', () => {
        const processor = new HeadingProcessor();
        registry.register('h1', processor);

        expect(registry.hasProcessor('h1')).toBe(true);
    });

    it('should register for multiple tags', () => {
        const processor = new HeadingProcessor();
        registry.register(['h1', 'h2', 'h3'], processor);

        expect(registry.hasProcessor('h1')).toBe(true);
        expect(registry.hasProcessor('h2')).toBe(true);
    });

    it('should use default processor for unknown tags', () => {
        const defaultProc = new DivProcessor();
        registry.setDefault(defaultProc);

        expect(registry.getProcessor('unknown')).toBe(defaultProc);
    });
});

// HEADING PROCESSOR
describe('HeadingProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new HeadingProcessor();
    });

    it('should convert h1 to heading', () => {
        const h1 = html('<h1>Title</h1>');
        const result = processor.process(h1);

        expect(result.name).toBe('heading');
        expect(result.settings.tag).toBe('h1');
        expect(result.settings.text).toBe('Title');
    });

    it('should handle h1 through h6', () => {
        const h3 = html('<h3>Subtitle</h3>');
        const result = processor.process(h3);

        expect(result.name).toBe('heading');
        expect(result.settings.tag).toBe('h3');
    });
});

// TEXT PROCESSOR
describe('TextProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new TextProcessor();
    });

    it('should convert paragraph', () => {
        const p = html('<p>Text</p>');
        const result = processor.process(p);

        expect(result.name).toBe('text-basic');
        expect(result.settings.tag).toBe('p');
    });

    it('should convert span', () => {
        const span = html('<span>Text</span>');
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

    it('should convert button', () => {
        const btn = html('<button>Click</button>');
        const result = processor.process(btn);

        expect(result.name).toBe('button');
        expect(result.settings.text).toBeDefined();
    });
});

// DIV PROCESSOR
describe('DivProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new DivProcessor();
    });

    it('should convert div', () => {
        const div = html('<div>Content</div>');
        const result = processor.process(div, { parentId: '0' });

        expect(result.name).toBe('div');
        expect(result.parent).toBe('0');
    });
});

/**
 * Unit Tests for Converter Services
 * Example test structure using Vitest
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ConverterService } from '../services/converter/ConverterService';
import { DomParser } from '../services/converter/DomParser';
import { CssProcessor } from '../services/converter/CssProcessor';
import { BricksBuilder } from '../services/converter/BricksBuilder';

describe('ConverterService', () => {
    let converter;

    beforeEach(() => {
        converter = new ConverterService();
    });

    describe('convert()', () => {
        it('should convert simple HTML to Bricks structure', () => {
            const html = '<div>Hello World</div>';
            const result = converter.convert(html);

            expect(result).toHaveProperty('content');
            expect(result).toHaveProperty('globalClasses');
            expect(result.version).toBe('2.0');
            expect(result.content.length).toBeGreaterThan(0);
        });

        it('should handle HTML with CSS', () => {
            const html = '<div class="box">Content</div>';
            const css = '.box { padding: 20px; }';
            const result = converter.convert(html, css);

            expect(result.globalClasses.length).toBeGreaterThan(0);
            expect(result.globalClasses[0].name).toBe('box');
        });

        it('should include JavaScript when provided', () => {
            const html = '<div>Test</div>';
            const js = 'console.log("Hello");';
            const result = converter.convert(html, '', js);

            const jsElement = result.content.find(el => el.name === 'code');
            expect(jsElement).toBeDefined();
            expect(jsElement.settings.javascriptCode).toContain('Hello');
        });

        it('should respect inlineStyleHandling option', () => {
            const html = '<div style="color: red;">Text</div>';

            const result = converter.convert(html, '', '', {
                inlineStyleHandling: 'class'
            });

            // Should have global class for inline styles
            expect(result.globalClasses.length).toBeGreaterThan(0);
        });
    });

    describe('setOptions()', () => {
        it('should update options', () => {
            converter.setOptions({ minifyOutput: true });
            const options = converter.getOptions();

            expect(options.minifyOutput).toBe(true);
        });

        it('should merge with existing options', () => {
            const defaultOptions = converter.getOptions();
            converter.setOptions({ minifyOutput: true });
            const newOptions = converter.getOptions();

            expect(newOptions.inlineStyleHandling).toBe(defaultOptions.inlineStyleHandling);
            expect(newOptions.minifyOutput).toBe(true);
        });
    });
});

describe('DomParser', () => {
    let parser;

    beforeEach(() => {
        parser = new DomParser();
    });

    it('should parse HTML string', () => {
        const html = '<div>Test</div>';
        const doc = parser.parse(html);

        expect(doc.body).toBeDefined();
        expect(doc.body.querySelector('div')).toBeDefined();
    });

    it('should validate elements correctly', () => {
        const html = '<div>Valid</div><p></p>';
        const doc = parser.parse(html);
        const div = doc.querySelector('div');
        const emptyP = doc.querySelector('p');

        expect(parser.isValidElement(div)).toBe(true);
        expect(parser.isValidElement(emptyP)).toBe(false);
    });
});

describe('CssProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new CssProcessor();
    });

    it('should parse CSS and extract variables', () => {
        const css = ':root { --primary: blue; } .box { color: var(--primary); }';
        const context = processor.parse(css);

        expect(context.variables).toHaveProperty('--primary');
        expect(context.cssMap).toHaveProperty('.box');
    });

    it('should return empty context for invalid CSS', () => {
        const context = processor.parse('');

        expect(context.cssMap).toEqual({});
        expect(context.variables).toEqual({});
    });

    it('should reset state', () => {
        processor.parse('.box { color: red; }');
        processor.reset();

        expect(processor.cssMap).toEqual({});
        expect(processor.variables).toEqual({});
    });
});

describe('BricksBuilder', () => {
    let builder;

    beforeEach(() => {
        builder = new BricksBuilder();
    });

    it('should build Bricks structure', () => {
        const elements = [
            { id: '1', name: 'div', parent: '0', children: [], settings: {} }
        ];
        const globalClasses = [];

        const result = builder.build(elements, globalClasses);

        expect(result.content).toEqual(elements);
        expect(result.version).toBe('2.0');
        expect(result.source).toBe('bricksCopiedElements');
    });

    it('should add JavaScript element', () => {
        builder.build([], []);
        builder.addJavaScript('console.log("test");');

        const structure = builder.getStructure();
        const jsElement = structure.content.find(el => el.name === 'code');

        expect(jsElement).toBeDefined();
        expect(jsElement.settings.javascriptCode).toBe('console.log("test");');
    });

    it('should add root styles to global classes', () => {
        const globalClasses = [
            { id: '1', name: 'test', settings: {} }
        ];

        builder.build([], globalClasses);
        builder.addRootStyles(':root { font-size: 16px; }');

        expect(globalClasses[0].settings._cssCustom).toContain('font-size: 16px');
    });
});

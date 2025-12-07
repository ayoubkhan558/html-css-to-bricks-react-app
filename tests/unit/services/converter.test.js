/**
 * Simplified Converter Service Tests
 * Tests the core conversion services
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ConverterService } from '../../../src/services/converter/ConverterService';
import { DomParser } from '../../../src/services/converter/DomParser';
import { CssProcessor } from '../../../src/services/converter/CssProcessor';
import { BricksBuilder } from '../../../src/services/converter/BricksBuilder';

// CONVERTER SERVICE
describe('ConverterService', () => {
    let converter;

    beforeEach(() => {
        converter = new ConverterService();
    });

    it('should convert simple HTML', () => {
        const html = '<div>Hello World</div>';
        const result = converter.convert(html);

        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.version).toBe('2.1.4');
    });

    it('should handle HTML with CSS', () => {
        const html = '<div class="box">Content</div>';
        const css = '.box { padding: 20px; }';
        const result = converter.convert(html, css);

        expect(result.globalClasses.length).toBeGreaterThan(0);
    });

    it('should include JavaScript when provided', () => {
        const html = '<div>Test</div>';
        const js = 'console.log("Hello");';
        const result = converter.convert(html, '', js);

        const jsElement = result.content.find(el => el.name === 'code');
        expect(jsElement).toBeDefined();
    });

    it('should skip JavaScript when includeJs is false', () => {
        const html = '<div>Test</div>';
        const js = 'console.log("Hello");';
        const result = converter.convert(html, '', js, { includeJs: false });

        const jsElement = result.content.find(el => el.name === 'code');
        expect(jsElement).toBeUndefined();
    });

    it('should update options', () => {
        converter.setOptions({ minifyOutput: true });
        const options = converter.getOptions();

        expect(options.minifyOutput).toBe(true);
    });
});

// DOM PARSER
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

    it('should validate elements', () => {
        const html = '<div>Valid</div><p></p>';
        const doc = parser.parse(html);
        const div = doc.querySelector('div');
        const emptyP = doc.querySelector('p');

        expect(parser.isValidElement(div)).toBe(true);
        expect(parser.isValidElement(emptyP)).toBe(false);
    });

    it('should handle null input', () => {
        expect(parser.isValidElement(null)).toBe(false);
    });
});

// CSS PROCESSOR
describe('CssProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new CssProcessor();
    });

    it('should parse CSS', () => {
        const css = '.box { padding: 20px; }';
        const context = processor.parse(css);

        expect(context.cssMap).toBeDefined();
    });

    it('should extract CSS variables', () => {
        const css = ':root { --primary: blue; }';
        const context = processor.parse(css);

        expect(context.variables).toBeDefined();
    });

    it('should handle empty CSS', () => {
        const context = processor.parse('');

        expect(context.cssMap).toEqual({});
        expect(context.variables).toEqual({});
    });

    it('should reset state', () => {
        processor.parse('.box { color: red; }');
        processor.reset();

        expect(processor.cssMap).toEqual({});
    });
});

// BRICKS BUILDER
describe('BricksBuilder', () => {
    let builder;

    beforeEach(() => {
        builder = new BricksBuilder();
    });

    it('should build Bricks structure', () => {
        const elements = [
            { id: '1', name: 'div', parent: '0', children: [], settings: {} }
        ];
        const result = builder.build(elements, []);

        expect(result.content).toEqual(elements);
        expect(result.version).toBe('2.1.4');
    });

    it('should add JavaScript', () => {
        builder.build([], []);
        builder.addJavaScript('console.log("test");');

        const structure = builder.getStructure();
        const jsElement = structure.content.find(el => el.name === 'code');

        expect(jsElement).toBeDefined();
    });

    it('should not add empty JavaScript', () => {
        builder.build([], []);
        builder.addJavaScript('');

        const structure = builder.getStructure();
        const jsElement = structure.content.find(el => el.name === 'code');

        expect(jsElement).toBeUndefined();
    });
});

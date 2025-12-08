/**
 * Simple Tests for Converter Services
 * 
 * These tests check if HTML/CSS/JS converts to Bricks format correctly.
 * Each test is simple and focuses on one thing.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ConverterService } from '../src/services/converter/ConverterService';
import { DomParser } from '../src/services/converter/DomParser';
import { CssProcessor } from '../src/services/converter/CssProcessor';
import { BricksBuilder } from '../src/services/converter/BricksBuilder';

// CONVERTER SERVICE TESTS
describe('ConverterService', () => {
    let converter;

    beforeEach(() => {
        converter = new ConverterService();
    });

    // TEST: Can we convert simple HTML?
    it('should convert HTML to Bricks', () => {
        const html = '<div>Hello</div>';
        const result = converter.convert(html);

        expect(result.content).toBeDefined();
        expect(result.version).toBe('2.1.4');
    });

    // TEST: Does it handle CSS?
    it('should handle CSS', () => {
        const html = '<div class="box">Content</div>';
        const css = '.box { padding: 20px; }';
        const result = converter.convert(html, css);

        expect(result.globalClasses.length).toBeGreaterThan(0);
    });

    // TEST: Does it include JavaScript?
    it('should include JavaScript', () => {
        const html = '<div>Test</div>';
        const js = 'console.log("test");';
        const result = converter.convert(html, '', js);

        const hasJs = result.content.some(el => el.name === 'code');
        expect(hasJs).toBe(true);
    });
});

// DOM PARSER TESTS
describe('DomParser', () => {
    let parser;

    beforeEach(() => {
        parser = new DomParser();
    });

    // TEST: Can it parse HTML?
    it('should parse HTML', () => {
        const html = '<div>Test</div>';
        const doc = parser.parse(html);

        expect(doc.body).toBeDefined();
        expect(doc.querySelector('div')).toBeDefined();
    });

    // TEST: Does it validate elements?  
    it('should validate elements', () => {
        const html = '<div>Valid</div>';
        const doc = parser.parse(html);
        const div = doc.querySelector('div');

        expect(parser.isValidElement(div)).toBe(true);
        expect(parser.isValidElement(null)).toBe(false);
    });
});

// CSS PROCESSOR TESTS
describe('CssProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new CssProcessor();
    });

    // TEST: Can it parse CSS?
    it('should parse CSS', () => {
        const css = '.box { padding: 20px; }';
        const context = processor.parse(css);

        expect(context.cssMap).toBeDefined();
    });

    // TEST: Does it extract variables?
    it('should extract CSS variables', () => {
        const css = ':root { --color: blue; }';
        const context = processor.parse(css);

        expect(context.variables).toBeDefined();
    });
});

// BRICKS BUILDER TESTS
describe('BricksBuilder', () => {
    let builder;

    beforeEach(() => {
        builder = new BricksBuilder();
    });

    // TEST: Can it build structure?
    it('should build Bricks structure', () => {
        const elements = [
            { id: '1', name: 'div', parent: '0', children: [], settings: {} }
        ];
        const result = builder.build(elements, []);

        expect(result.version).toBe('2.1.4');
        expect(result.content).toEqual(elements);
    });

    // TEST: Can it add JavaScript?
    it('should add JavaScript', () => {
        builder.build([], []);
        builder.addJavaScript('console.log("test");');

        const structure = builder.getStructure();
        const hasJs = structure.content.some(el => el.name === 'code');

        expect(hasJs).toBe(true);
    });
});

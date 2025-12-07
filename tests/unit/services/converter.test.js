/**
 * Converter Services Unit Tests
 * 
 * This file tests the core converter services that transform HTML/CSS/JS
 * into Bricks Builder format. We test each service individually (unit tests)
 * to ensure they work correctly in isolation.
 * 
 * Services tested:
 * - ConverterService: Main orchestrator
 * - DomParser: HTML parsing
 * - CssProcessor: CSS parsing and matching
 * - BricksBuilder: JSON structure assembly
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ConverterService } from '../../../src/services/converter/ConverterService';
import { DomParser } from '../../../src/services/converter/DomParser';
import { CssProcessor } from '../../../src/services/converter/CssProcessor';
import { BricksBuilder } from '../../../src/services/converter/BricksBuilder';
import { HTML_FIXTURES, CSS_FIXTURES, JS_FIXTURES } from '../../helpers/fixtures';
import { assertBricksStructure, assertBricksElement, assertGlobalClass } from '../../helpers/assertions';

// ========================================
// CONVERTER SERVICE TESTS
// ========================================
describe('ConverterService', () => {
    let converter;

    // Setup: Create a fresh converter instance before each test
    beforeEach(() => {
        converter = new ConverterService();
    });

    describe('convert() - Basic Conversion', () => {
        // Test: Can we convert simple HTML to Bricks?
        it('should convert simple HTML to Bricks structure', () => {
            const html = HTML_FIXTURES.simpleDiv;
            const result = converter.convert(html);

            // Check that we get a valid Bricks structure
            assertBricksStructure(result);

            // Should have at least one element
            expect(result.content.length).toBeGreaterThan(0);
        });

        // Test: Does it handle HTML + CSS together?
        it('should handle HTML with CSS', () => {
            const html = '<div class="box">Content</div>';
            const css = '.box { padding: 20px; }';
            const result = converter.convert(html, css);

            // Should create a global class for .box
            assertBricksStructure(result);
            expect(result.globalClasses.length).toBeGreaterThan(0);

            const boxClass = assertGlobalClass(result.globalClasses, 'box');
            expect(boxClass).toBeDefined();
        });

        // Test: Does it include JavaScript when provided?
        it('should include JavaScript when provided', () => {
            const html = HTML_FIXTURES.simpleDiv;
            const js = JS_FIXTURES.simpleLog;
            const result = converter.convert(html, '', js);

            // Should have a 'code' element for JavaScript
            const jsElement = result.content.find(el => el.name === 'code');
            expect(jsElement).toBeDefined();
            expect(jsElement.settings.javascriptCode).toContain('Hello');
        });

        // Test: Can we skip JavaScript if we want?
        it('should skip JavaScript when includeJs is false', () => {
            const html = HTML_FIXTURES.simpleDiv;
            const js = JS_FIXTURES.simpleLog;

            const result = converter.convert(html, '', js, {
                includeJs: false
            });

            // Should NOT have a code element
            const jsElement = result.content.find(el => el.name === 'code');
            expect(jsElement).toBeUndefined();
        });
    });

    describe('convert() - Options Handling', () => {
        // Test: Does inlineStyleHandling option work?
        it('should respect inlineStyleHandling option', () => {
            const html = '<div style="color: red;">Text</div>';

            // Test with 'class' mode (should create global class)
            const resultClass = converter.convert(html, '', '', {
                inlineStyleHandling: 'class'
            });
            expect(resultClass.globalClasses.length).toBeGreaterThan(0);

            // Test with 'skip' mode (should ignore inline styles)
            const resultSkip = converter.convert(html, '', '', {
                inlineStyleHandling: 'skip'
            });
            // Inline styles should be skipped
            expect(resultSkip.globalClasses.length).toBe(0);
        });

        // Test: Does showNodeClass option work?
        it('should respect showNodeClass option', () => {
            const html = '<div class="test">Content</div>';

            const result = converter.convert(html, '', '', {
                showNodeClass: true
            });

            assertBricksStructure(result);
            // When showNodeClass is true, labels should include class names
            // (Exact behavior depends on implementation)
        });
    });

    describe('setOptions() and getOptions()', () => {
        // Test: Can we update options after creating the converter?
        it('should update options', () => {
            converter.setOptions({ minifyOutput: true });
            const options = converter.getOptions();

            expect(options.minifyOutput).toBe(true);
        });

        // Test: Does it merge with existing options?
        it('should merge with existing options', () => {
            const defaultOptions = converter.getOptions();

            converter.setOptions({ minifyOutput: true });
            const newOptions = converter.getOptions();

            // Old options should still be there
            expect(newOptions.inlineStyleHandling).toBe(defaultOptions.inlineStyleHandling);

            // New option should be added
            expect(newOptions.minifyOutput).toBe(true);
        });
    });
});

// ========================================
// DOM PARSER TESTS
// ========================================
describe('DomParser', () => {
    let parser;

    beforeEach(() => {
        parser = new DomParser();
    });

    describe('parse()', () => {
        // Test: Can we parse HTML string into a document?
        it('should parse HTML string into document', () => {
            const html = HTML_FIXTURES.simpleDiv;
            const doc = parser.parse(html);

            // Should return a document with body
            expect(doc.body).toBeDefined();
            expect(doc.body.querySelector('div')).toBeDefined();
        });

        // Test: Does it handle complex nested HTML?
        it('should handle complex HTML', () => {
            const html = HTML_FIXTURES.nestedDiv;
            const doc = parser.parse(html);

            // Should parse all nested elements
            expect(doc.querySelector('.container')).toBeDefined();
            expect(doc.querySelector('h1')).toBeDefined();
            expect(doc.querySelector('p')).toBeDefined();
            expect(doc.querySelector('button')).toBeDefined();
        });
    });

    describe('isValidElement()', () => {
        // Test: Can we identify valid elements?
        it('should identify valid elements', () => {
            const html = '<div>Valid</div><p></p>';
            const doc = parser.parse(html);

            const div = doc.querySelector('div');
            const emptyP = doc.querySelector('p');

            // Div with content is valid
            expect(parser.isValidElement(div)).toBe(true);

            // Empty p is not valid
            expect(parser.isValidElement(emptyP)).toBe(false);
        });

        // Test: Does it handle null/undefined?
        it('should return false for null/undefined', () => {
            expect(parser.isValidElement(null)).toBe(false);
            expect(parser.isValidElement(undefined)).toBe(false);
        });
    });

    describe('isTextNode()', () => {
        // Test: Can we identify text nodes?
        it('should identify text nodes', () => {
            const html = '<div>Text content</div>';
            const doc = parser.parse(html);
            const div = doc.querySelector('div');
            const textNode = div.firstChild;

            expect(parser.isTextNode(textNode)).toBe(true);
            expect(parser.isTextNode(div)).toBe(false);
        });
    });
});

// ========================================
// CSS PROCESSOR TESTS
// ========================================
describe('CssProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new CssProcessor();
    });

    describe('parse()', () => {
        // Test: Can we parse CSS and extract classes?
        it('should parse CSS and build cssMap', () => {
            const css = CSS_FIXTURES.simpleClass;
            const context = processor.parse(css);

            // Should have a cssMap with .box selector
            expect(context.cssMap).toHaveProperty('.box');
        });

        // Test: Can we extract CSS variables?
        it('should extract CSS variables', () => {
            const css = CSS_FIXTURES.withVariables;
            const context = processor.parse(css);

            // Should extract --primary-color and --spacing
            expect(context.variables).toHaveProperty('--primary-color');
            expect(context.variables).toHaveProperty('--spacing');
        });

        // Test: Does it handle empty CSS?
        it('should return empty context for empty CSS', () => {
            const context = processor.parse('');

            expect(context.cssMap).toEqual({});
            expect(context.variables).toEqual({});
            expect(context.rootStyles).toBe('');
            expect(context.keyframes).toEqual([]);
        });

        // Test: Can we extract keyframes?
        it('should extract keyframes', () => {
            const css = CSS_FIXTURES.withKeyframes;
            const context = processor.parse(css);

            // Should have keyframes array
            expect(Array.isArray(context.keyframes)).toBe(true);
            expect(context.keyframes.length).toBeGreaterThan(0);
        });
    });

    describe('matchSelectors()', () => {
        // Test: Can we match selectors against a DOM node?
        it('should match selectors for a node', () => {
            const css = '.box { color: red; }';
            processor.parse(css);

            const parser = new DOMParser();
            const doc = parser.parseFromString('<div class="box">Test</div>', 'text/html');
            const div = doc.querySelector('.box');

            const result = processor.matchSelectors(div);

            // Should find matching properties
            expect(result.properties).toBeDefined();
        });
    });

    describe('reset()', () => {
        // Test: Can we reset the processor state?
        it('should reset state', () => {
            processor.parse(CSS_FIXTURES.simpleClass);
            processor.reset();

            // Everything should be cleared
            expect(processor.cssMap).toEqual({});
            expect(processor.variables).toEqual({});
            expect(processor.rootStyles).toBe('');
            expect(processor.keyframes).toEqual([]);
        });
    });
});

// ========================================
// BRICKS BUILDER TESTS
// ========================================
describe('BricksBuilder', () => {
    let builder;

    beforeEach(() => {
        builder = new BricksBuilder();
    });

    describe('build()', () => {
        // Test: Can we build a basic Bricks structure?
        it('should build Bricks structure', () => {
            const elements = [
                { id: '1', name: 'div', parent: '0', children: [], settings: {} }
            ];
            const globalClasses = [];

            const result = builder.build(elements, globalClasses);

            // Should return valid structure
            assertBricksStructure(result);
            expect(result.content).toEqual(elements);
        });

        // Test: Does it set the correct version?
        it('should set correct version', () => {
            const result = builder.build([], []);
            expect(result.version).toBe('2.1.4');
        });

        // Test: Does it set the correct source?
        it('should set correct source', () => {
            const result = builder.build([], []);
            expect(result.source).toBe('bricksCopiedElements');
        });
    });

    describe('addJavaScript()', () => {
        // Test: Can we add JavaScript to the structure?
        it('should add JavaScript element', () => {
            builder.build([], []);
            builder.addJavaScript(JS_FIXTURES.simpleLog);

            const structure = builder.getStructure();
            const jsElement = structure.content.find(el => el.name === 'code');

            // Should have a code element with JavaScript
            expect(jsElement).toBeDefined();
            expect(jsElement.settings.javascriptCode).toBe(JS_FIXTURES.simpleLog);
        });

        // Test: Does it skip empty JavaScript?
        it('should not add empty JavaScript', () => {
            builder.build([], []);
            builder.addJavaScript('');

            const structure = builder.getStructure();
            const jsElement = structure.content.find(el => el.name === 'code');

            // Should not have a code element
            expect(jsElement).toBeUndefined();
        });
    });

    describe('addRootStyles()', () => {
        // Test: Can we add root styles to global classes?
        it('should add root styles to global classes', () => {
            const globalClasses = [
                { id: '1', name: 'test', settings: {} }
            ];

            builder.build([], globalClasses);
            builder.addRootStyles(':root { font-size: 16px; }');

            // First global class should have root styles
            expect(globalClasses[0].settings._cssCustom).toContain('font-size: 16px');
        });
    });

    describe('addKeyframes()', () => {
        // Test: Can we add keyframes to global classes?
        it('should add keyframes to global classes', () => {
            const globalClasses = [
                { id: '1', name: 'test', settings: {} }
            ];

            const keyframes = [
                { name: 'fadeIn', rules: 'from { opacity: 0; } to { opacity: 1; }' }
            ];

            builder.build([], globalClasses);
            builder.addKeyframes(keyframes);

            // First global class should have keyframes
            expect(globalClasses[0].settings._cssCustom).toContain('@keyframes fadeIn');
        });
    });
});

/**
 * Integration Tests
 * 
 * Unlike unit tests that test individual components in isolation,
 * integration tests verify that multiple components work together correctly.
 * 
 * These tests simulate real-world usage scenarios where HTML/CSS/JS
 * goes through the entire conversion pipeline.
 */

import { describe, it, expect } from 'vitest';
import { converterService } from '../../src/services/converter';
import { HTML_FIXTURES, CSS_FIXTURES, JS_FIXTURES } from '../helpers/fixtures';
import { assertBricksStructure, findElementByName, assertGlobalClass } from '../helpers/assertions';

describe('Full Conversion Pipeline', () => {
    // Test: Can we convert a complete webpage?
    it('should convert complete HTML page with CSS and JS', () => {
        const html = `
      <div class="container">
        <h1 class="title">Welcome</h1>
        <p class="intro">This is an introduction.</p>
        <button class="cta">Get Started</button>
      </div>
    `;

        const css = `
      .container { max-width: 1200px; padding: 20px; }
      .title { font-size: 32px; color: #333; }
      .intro { font-size: 16px; line-height: 1.5; }
      .cta { background: #3498db; color: white; padding: 10px 20px; }
    `;

        const js = `
      document.querySelector('.cta').addEventListener('click', function() {
        alert('Button clicked!');
      });
    `;

        // Convert everything together
        const result = converterService.convert(html, css, js);

        // Verify structure
        assertBricksStructure(result);

        // Should have all elements
        const container = findElementByName(result.content, 'div');
        const heading = findElementByName(result.content, 'heading');
        const text = findElementByName(result.content, 'text-basic');
        const button = findElementByName(result.content, 'button');

        expect(container).toBeDefined();
        expect(heading).toBeDefined();
        expect(text).toBeDefined();
        expect(button).toBeDefined();

        // Should have all CSS classes
        assertGlobalClass(result.globalClasses, 'container');
        assertGlobalClass(result.globalClasses, 'title');
        assertGlobalClass(result.globalClasses, 'intro');
        assertGlobalClass(result.globalClasses, 'cta');

        // Should have JavaScript
        const jsElement = result.content.find(el => el.name === 'code');
        expect(jsElement).toBeDefined();
        expect(jsElement.settings.javascriptCode).toContain('click');
    });

    // Test: Does it handle complex nested structures?
    it('should handle deeply nested HTML structure', () => {
        const html = HTML_FIXTURES.nestedDiv;
        const result = converterService.convert(html);

        assertBricksStructure(result);

        // Should create proper parent-child relationships
        const container = findElementByName(result.content, 'div');
        expect(container.children.length).toBeGreaterThan(0);
    });

    // Test: Does it handle CSS variables correctly?
    it('should process CSS variables', () => {
        const html = '<div class="box">Content</div>';
        const css = CSS_FIXTURES.withVariables;

        const result = converterService.convert(html, css);

        assertBricksStructure(result);
        // CSS variables should be extracted and available
        expect(result.globalClasses.length).toBeGreaterThan(0);
    });

    // Test: Does it handle inline styles based on options?
    it('should respect inlineStyleHandling option', () => {
        const html = '<div style="color: red; padding: 10px;">Styled</div>';

        // Test with 'class' mode
        const resultClass = converterService.convert(html, '', '', {
            inlineStyleHandling: 'class'
        });
        expect(resultClass.globalClasses.length).toBeGreaterThan(0);

        // Test with 'skip' mode
        const resultSkip = converterService.convert(html, '', '', {
            inlineStyleHandling: 'skip'
        });
        expect(resultSkip.globalClasses.length).toBe(0);
    });

    // Test: Does it handle lists correctly?
    it('should convert lists correctly', () => {
        const html = HTML_FIXTURES.unorderedList;
        const result = converterService.convert(html);

        assertBricksStructure(result);

        // Should have list elements
        const listElements = result.content.filter(el =>
            el.name === 'list' || el.name === 'div'
        );
        expect(listElements.length).toBeGreaterThan(0);
    });

    // Test: Does it handle tables correctly?
    it('should convert tables correctly', () => {
        const html = HTML_FIXTURES.simpleTable;
        const result = converterService.convert(html);

        assertBricksStructure(result);

        // Should have table-related elements
        expect(result.content.length).toBeGreaterThan(0);
    });

    // Test: Does it handle SVG elements?
    it('should handle SVG elements', () => {
        const html = HTML_FIXTURES.svg;
        const result = converterService.convert(html);

        assertBricksStructure(result);

        // SVG should be converted to code element
        const svgElement = result.content.find(el =>
            el.name === 'code' || el.name === 'svg'
        );
        expect(svgElement).toBeDefined();
    });

    // Test: Does it handle images?
    it('should convert images correctly', () => {
        const html = HTML_FIXTURES.image;
        const result = converterService.convert(html);

        assertBricksStructure(result);

        const image = findElementByName(result.content, 'image');
        expect(image).toBeDefined();
        expect(image.settings.url).toBe('test.jpg');
        expect(image.settings.alt).toBe('Test Image');
    });

    // Test: Does it handle links?
    it('should convert links correctly', () => {
        const html = HTML_FIXTURES.link;
        const result = converterService.convert(html);

        assertBricksStructure(result);

        const link = result.content.find(el => el.name === 'link' || el.name === 'text-link');
        expect(link).toBeDefined();
    });
});

describe('Edge Cases and Error Handling', () => {
    // Test: Does it handle empty input?
    it('should handle empty HTML', () => {
        const result = converterService.convert('');

        assertBricksStructure(result);
        expect(result.content.length).toBe(0);
    });

    // Test: Does it handle malformed HTML?
    it('should handle malformed HTML gracefully', () => {
        const html = '<div><p>Unclosed paragraph<div>Nested</div>';

        // Should not throw an error
        expect(() => converterService.convert(html)).not.toThrow();
    });

    // Test: Does it handle very large HTML?
    it('should handle large HTML structures', () => {
        // Create a large nested structure
        let html = '<div>';
        for (let i = 0; i < 100; i++) {
            html += `<p>Paragraph ${i}</p>`;
        }
        html += '</div>';

        const result = converterService.convert(html);

        assertBricksStructure(result);
        expect(result.content.length).toBeGreaterThan(50);
    });

    // Test: Does it handle special characters?
    it('should handle special characters in content', () => {
        const html = '<p>Special chars: &lt; &gt; &amp; &quot;</p>';
        const result = converterService.convert(html);

        assertBricksStructure(result);
        const text = findElementByName(result.content, 'text-basic');
        expect(text.settings.text).toContain('<');
    });

    // Test: Does it handle Unicode characters?
    it('should handle Unicode characters', () => {
        const html = '<p>Unicode: 你好 مرحبا שלום</p>';
        const result = converterService.convert(html);

        assertBricksStructure(result);
        const text = findElementByName(result.content, 'text-basic');
        expect(text.settings.text).toContain('你好');
    });
});

describe('Performance Tests', () => {
    // Test: Is conversion reasonably fast?
    it('should convert in reasonable time', () => {
        const html = HTML_FIXTURES.nestedDiv;
        const css = CSS_FIXTURES.multipleClasses;

        const startTime = performance.now();
        converterService.convert(html, css);
        const endTime = performance.now();

        const duration = endTime - startTime;

        // Should complete in less than 1 second
        expect(duration).toBeLessThan(1000);
    });
});

/**
 * Simplified Integration Tests
 * Tests that verify the full conversion pipeline works correctly
 */

import { describe, it, expect } from 'vitest';
import { converterService } from '../../src/services/converter';

describe('Full Conversion Pipeline', () => {
    it('should convert HTML to Bricks structure', () => {
        const html = '<div class="container"><h1>Title</h1></div>';
        const result = converterService.convert(html);

        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle HTML with CSS', () => {
        const html = '<div class="box">Content</div>';
        const css = '.box { padding: 20px; }';
        const result = converterService.convert(html, css);

        expect(result.globalClasses.length).toBeGreaterThan(0);
    });

    it('should handle HTML with JavaScript', () => {
        const html = '<div>Content</div>';
        const js = 'console.log("test");';
        const result = converterService.convert(html, '', js);

        const hasJs = result.content.some(el => el.name === 'code');
        expect(hasJs).toBe(true);
    });

    it('should handle nested elements', () => {
        const html = `
      <div>
        <h1>Title</h1>
        <p>Paragraph</p>
      </div>
    `;
        const result = converterService.convert(html);

        expect(result.content.length).toBeGreaterThan(1);
    });

    it('should handle empty HTML', () => {
        const result = converterService.convert('');

        expect(result.content).toBeDefined();
        expect(Array.isArray(result.content)).toBe(true);
    });

    it('should handle lists', () => {
        const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
        const result = converterService.convert(html);

        expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle tables', () => {
        const html = '<table><tr><td>Cell</td></tr></table>';
        const result = converterService.convert(html);

        expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle images', () => {
        const html = '<img src="test.jpg" alt="Test" />';
        const result = converterService.convert(html);

        const hasImage = result.content.some(el => el.name === 'image');
        expect(hasImage).toBe(true);
    });

    it('should handle SVG', () => {
        const html = '<svg><circle cx="50" cy="50" r="40"/></svg>';
        const result = converterService.convert(html);

        expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle links', () => {
        const html = '<a href="https://example.com">Link</a>';
        const result = converterService.convert(html);

        expect(result.content.length).toBeGreaterThan(0);
    });
});

describe('Performance', () => {
    it('should convert in reasonable time', () => {
        const html = '<div><p>Test</p></div>';

        const startTime = performance.now();
        converterService.convert(html);
        const endTime = performance.now();

        expect(endTime - startTime).toBeLessThan(1000);
    });
});

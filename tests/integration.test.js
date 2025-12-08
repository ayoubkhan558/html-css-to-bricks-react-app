/**
 * Simple Integration Tests
 * 
 * Integration tests check if the whole system works together.
 * These tests convert HTML/CSS/JS and verify the output is correct.
 */

import { describe, it, expect } from 'vitest';
import { converterService } from '../src/services/converter';

describe('Full Conversion', () => {
    // TEST: Can we convert HTML?
    it('should convert HTML', () => {
        const html = '<div>Hello</div>';
        const result = converterService.convert(html);

        expect(result.content).toBeDefined();
        expect(result.content.length).toBeGreaterThan(0);
    });

    // TEST: Does it handle CSS?
    it('should handle CSS', () => {
        const html = '<div class="box">Content</div>';
        const css = '.box { padding: 20px; }';
        const result = converterService.convert(html, css);

        expect(result.globalClasses.length).toBeGreaterThan(0);
    });

    // TEST: Does it include JavaScript?
    it('should handle JavaScript', () => {
        const html = '<div>Content</div>';
        const js = 'console.log("test");';
        const result = converterService.convert(html, '', js);

        const hasJs = result.content.some(el => el.name === 'code');
        expect(hasJs).toBe(true);
    });

    // TEST: Does it handle nested elements?
    it('should handle nested HTML', () => {
        const html = '<div><h1>Title</h1><p>Text</p></div>';
        const result = converterService.convert(html);

        expect(result.content.length).toBeGreaterThan(1);
    });

    // TEST: Does it handle empty input?
    it('should handle empty HTML', () => {
        const result = converterService.convert('');

        expect(result.content).toBeDefined();
        expect(Array.isArray(result.content)).toBe(true);
    });
});

describe('Performance', () => {
    // TEST: Is it fast enough?
    it('should convert quickly', () => {
        const html = '<div><p>Test</p></div>';

        const start = performance.now();
        converterService.convert(html);
        const end = performance.now();

        expect(end - start).toBeLessThan(1000); // Less than 1 second
    });
});

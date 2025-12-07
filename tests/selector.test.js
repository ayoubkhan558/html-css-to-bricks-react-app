/**
 * Simple Tests for AdvancedSelectorMatcher
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AdvancedSelectorMatcher } from '../src/lib/css/AdvancedSelectorMatcher';

describe('AdvancedSelectorMatcher', () => {
    let testDoc;

    beforeEach(() => {
        const parser = new DOMParser();
        testDoc = parser.parseFromString(`
      <div class="container">
        <h1 id="title">Title</h1>
        <p class="text">Paragraph</p>
      </div>
    `, 'text/html');
    });

    // TEST: Does .container match the div?
    it('should match class selector', () => {
        const div = testDoc.querySelector('.container');
        const matches = AdvancedSelectorMatcher.matches(div, '.container');

        expect(matches).toBe(true);
    });

    // TEST: Does #title match the h1?
    it('should match ID selector', () => {
        const h1 = testDoc.querySelector('h1');
        const matches = AdvancedSelectorMatcher.matches(h1, '#title');

        expect(matches).toBe(true);
    });

    // TEST: Does it return false for wrong selector?
    it('should not match wrong selector', () => {
        const div = testDoc.querySelector('div');
        const matches = AdvancedSelectorMatcher.matches(div, '.wrong-class');

        expect(matches).toBe(false);
    });

    // TEST: Does it handle invalid selectors safely?
    it('should handle invalid selectors', () => {
        const div = testDoc.querySelector('div');

        expect(AdvancedSelectorMatcher.matches(div, '[')).toBe(false);
    });

    // TEST: Can it calculate specificity?
    it('should calculate specificity', () => {
        expect(AdvancedSelectorMatcher.getSpecificity('#id')).toBe(100);
        expect(AdvancedSelectorMatcher.getSpecificity('.class')).toBe(10);
        expect(AdvancedSelectorMatcher.getSpecificity('div')).toBe(1);
    });

    // TEST: Can it detect complex selectors?
    it('should detect complex selectors', () => {
        const analysis = AdvancedSelectorMatcher.analyzeSelector('.parent > .child');

        expect(analysis.hasChild).toBe(true);
        expect(analysis.isComplex).toBe(true);
    });

    // TEST: Does cascade work correctly?
    it('should apply cascade based on specificity', () => {
        const cssMap = {
            'p': 'color: black;',
            '.text': 'color: blue;'
        };

        const p = testDoc.querySelector('.text');
        const result = AdvancedSelectorMatcher.matchWithCascade(p, cssMap);

        expect(result.appliedProperties.color).toBe('blue');
    });

    // TEST: Can it parse CSS properties?
    it('should parse CSS properties', () => {
        const props = AdvancedSelectorMatcher.parseProperties('color: red; padding: 10px;');

        expect(props.color).toBe('red');
        expect(props.padding).toBe('10px');
    });

    // TEST: Does it validate good selectors?
    it('should validate correct selectors', () => {
        expect(AdvancedSelectorMatcher.isValidSelector('.class')).toBe(true);
        expect(AdvancedSelectorMatcher.isValidSelector('#id')).toBe(true);
        expect(AdvancedSelectorMatcher.isValidSelector('div')).toBe(true);
    });

    // TEST: Does it reject bad selectors?
    it('should reject invalid selectors', () => {
        expect(AdvancedSelectorMatcher.isValidSelector('[')).toBe(false);
    });
});

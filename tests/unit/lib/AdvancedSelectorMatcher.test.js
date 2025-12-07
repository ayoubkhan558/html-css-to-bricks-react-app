/**
 * AdvancedSelectorMatcher Unit Tests
 * 
 * This file tests the AdvancedSelectorMatcher class which handles complex
 * CSS selector matching using the browser's native element.matches() API.
 * 
 * What we're testing:
 * - Basic selector matching (class, ID, element)
 * - Complex selectors (descendant, child, attribute, pseudo-classes)
 * - Specificity calculation
 * - Cascade handling (which styles win when multiple selectors match)
 * - Selector validation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AdvancedSelectorMatcher } from '../../../src/lib/css/AdvancedSelectorMatcher';
import { createDocumentFromHTML } from '../../helpers/fixtures';

describe('AdvancedSelectorMatcher', () => {
    // Setup: Create a sample DOM structure before each test
    // This gives us a consistent starting point for all tests
    let doc;

    beforeEach(() => {
        // Create a sample HTML document for testing
        doc = createDocumentFromHTML(`
      <div class="container">
        <h1 id="title">Main Title</h1>
        <p class="intro">Introduction</p>
        <div class="content">
          <p class="text">Content text</p>
          <button disabled>Submit</button>
        </div>
      </div>
    `);
    });

    // ===== BASIC SELECTOR MATCHING =====
    describe('matches() - Basic Selectors', () => {
        // Test: Can we match a simple class selector?
        it('should match class selector', () => {
            const container = doc.querySelector('.container');

            // The container div should match the .container selector
            expect(AdvancedSelectorMatcher.matches(container, '.container')).toBe(true);

            // But it should NOT match a different class
            expect(AdvancedSelectorMatcher.matches(container, '.non-existent')).toBe(false);
        });

        // Test: Can we match an ID selector?
        it('should match ID selector', () => {
            const title = doc.querySelector('h1');

            // The h1 should match #title
            expect(AdvancedSelectorMatcher.matches(title, '#title')).toBe(true);
        });

        // Test: Can we match an element type selector?
        it('should match element selector', () => {
            const paragraph = doc.querySelector('p');

            // The p element should match 'p' selector
            expect(AdvancedSelectorMatcher.matches(paragraph, 'p')).toBe(true);
        });

        // Test: How does it handle invalid selectors?
        it('should handle invalid selectors gracefully', () => {
            const div = doc.querySelector('div');

            // Invalid selectors should return false, not throw errors
            expect(AdvancedSelectorMatcher.matches(div, '???invalid')).toBe(false);
        });
    });

    // ===== COMPLEX SELECTOR MATCHING =====
    describe('matches() - Complex Selectors', () => {
        // Test: Descendant selector (space between selectors)
        it('should match descendant selector (.parent .child)', () => {
            const text = doc.querySelector('.content .text');

            // .text is inside .container, so it should match
            expect(AdvancedSelectorMatcher.matches(text, '.container .text')).toBe(true);
        });

        // Test: Direct child selector (>)
        it('should match child selector (.parent > .child)', () => {
            const intro = doc.querySelector('.intro');

            // .intro is a direct child of .container
            expect(AdvancedSelectorMatcher.matches(intro, '.container > .intro')).toBe(true);

            // But .text is NOT a direct child of .container (it's nested deeper)
            const text = doc.querySelector('.text');
            expect(AdvancedSelectorMatcher.matches(text, '.container > .text')).toBe(false);
        });

        // Test: Attribute selector
        it('should match attribute selector', () => {
            const button = doc.querySelector('button');

            // Button has disabled attribute
            expect(AdvancedSelectorMatcher.matches(button, 'button[disabled]')).toBe(true);
            expect(AdvancedSelectorMatcher.matches(button, '[disabled]')).toBe(true);
        });

        // Test: Pseudo-class selector
        it('should match pseudo-class selector', () => {
            const firstP = doc.querySelector('p');

            // First p element should match :first-of-type
            expect(AdvancedSelectorMatcher.matches(firstP, 'p:first-of-type')).toBe(true);
        });
    });

    // ===== SPECIFICITY CALCULATION =====
    describe('getSpecificity()', () => {
        // Specificity determines which CSS rule wins when multiple rules apply
        // Calculation: IDs = 100, Classes = 10, Elements = 1

        it('should calculate ID specificity (100)', () => {
            expect(AdvancedSelectorMatcher.getSpecificity('#id')).toBe(100);
        });

        it('should calculate class specificity (10)', () => {
            expect(AdvancedSelectorMatcher.getSpecificity('.class')).toBe(10);
        });

        it('should calculate element specificity (1)', () => {
            expect(AdvancedSelectorMatcher.getSpecificity('div')).toBe(1);
        });

        it('should calculate combined specificity', () => {
            // #id (100) + .class (10) + div (1) = 111
            expect(AdvancedSelectorMatcher.getSpecificity('#id .class div')).toBe(111);
        });

        it('should handle complex selectors', () => {
            // .container (10) + p (1) + .text (10) + :first-child (10) = 31
            const specificity = AdvancedSelectorMatcher.getSpecificity('.container > p.text:first-child');
            expect(specificity).toBeGreaterThan(0);
        });
    });

    // ===== SELECTOR ANALYSIS =====
    describe('analyzeSelector()', () => {
        // This tests our ability to detect what features a selector uses

        it('should detect descendant selector', () => {
            const analysis = AdvancedSelectorMatcher.analyzeSelector('.parent .child');
            expect(analysis.hasDescendant).toBe(true);
        });

        it('should detect child selector', () => {
            const analysis = AdvancedSelectorMatcher.analyzeSelector('.parent > .child');
            expect(analysis.hasChild).toBe(true);
            expect(analysis.isComplex).toBe(true);
        });

        it('should detect attribute selector', () => {
            const analysis = AdvancedSelectorMatcher.analyzeSelector('input[type="text"]');
            expect(analysis.hasAttribute).toBe(true);
            expect(analysis.isComplex).toBe(true);
        });

        it('should detect pseudo-class', () => {
            const analysis = AdvancedSelectorMatcher.analyzeSelector('li:first-child');
            expect(analysis.hasPseudoClass).toBe(true);
            expect(analysis.isComplex).toBe(true);
        });

        it('should detect :not() selector', () => {
            const analysis = AdvancedSelectorMatcher.analyzeSelector('div:not(.exclude)');
            expect(analysis.hasNot).toBe(true);
        });

        it('should detect nth-child selector', () => {
            const analysis = AdvancedSelectorMatcher.analyzeSelector('li:nth-child(2)');
            expect(analysis.hasNthChild).toBe(true);
        });
    });

    // ===== CASCADE HANDLING =====
    describe('matchWithCascade()', () => {
        // The cascade determines which styles apply when multiple selectors match
        // More specific selectors override less specific ones

        it('should apply cascade correctly', () => {
            // Setup: Create CSS rules with different specificity
            const cssMap = {
                'p': 'color: black; font-size: 14px;',           // Specificity: 1
                '.text': 'color: blue;',                         // Specificity: 10
                '.content .text': 'color: red; font-weight: bold;' // Specificity: 20
            };

            const textElement = doc.querySelector('.content .text');
            const result = AdvancedSelectorMatcher.matchWithCascade(textElement, cssMap);

            // Most specific selector (.content .text) should win for color
            expect(result.appliedProperties.color).toBe('red');

            // Properties from less specific selectors still apply if not overridden
            expect(result.appliedProperties['font-size']).toBe('14px');
            expect(result.appliedProperties['font-weight']).toBe('bold');

            // All three selectors should match
            expect(result.matchingSelectors).toHaveLength(3);
        });

        it('should respect specificity order', () => {
            const cssMap = {
                'p': 'color: black;',              // Specificity: 1
                '.text': 'color: blue;',           // Specificity: 10
                '#special-text': 'color: green;'   // Specificity: 100
            };

            // Create element with ID
            const docWithId = createDocumentFromHTML(`
        <p id="special-text" class="text">Test</p>
      `);

            const textElement = docWithId.querySelector('p');
            const result = AdvancedSelectorMatcher.matchWithCascade(textElement, cssMap);

            // ID selector (specificity 100) should win
            expect(result.appliedProperties.color).toBe('green');
        });

        it('should handle empty CSS map', () => {
            const div = doc.querySelector('div');
            const result = AdvancedSelectorMatcher.matchWithCascade(div, {});

            // No selectors should match
            expect(result.matchingSelectors).toHaveLength(0);
            expect(result.appliedProperties).toEqual({});
            expect(result.specificity).toBe(0);
        });
    });

    // ===== SELECTOR VALIDATION =====
    describe('isValidSelector()', () => {
        it('should validate correct selectors', () => {
            expect(AdvancedSelectorMatcher.isValidSelector('.class')).toBe(true);
            expect(AdvancedSelectorMatcher.isValidSelector('#id')).toBe(true);
            expect(AdvancedSelectorMatcher.isValidSelector('div > p')).toBe(true);
            expect(AdvancedSelectorMatcher.isValidSelector('[data-attr="value"]')).toBe(true);
        });

        it('should invalidate incorrect selectors', () => {
            expect(AdvancedSelectorMatcher.isValidSelector('???invalid')).toBe(false);
            expect(AdvancedSelectorMatcher.isValidSelector('[broken')).toBe(false);
        });
    });

    // ===== PROPERTY PARSING =====
    describe('parseProperties()', () => {
        it('should parse CSS properties string', () => {
            const props = AdvancedSelectorMatcher.parseProperties('color: red; font-size: 16px;');

            expect(props.color).toBe('red');
            expect(props['font-size']).toBe('16px');
        });

        it('should handle properties with colons in values (URLs)', () => {
            const props = AdvancedSelectorMatcher.parseProperties('background: url(http://example.com/img.png);');

            expect(props.background).toBe('url(http://example.com/img.png)');
        });

        it('should return object if already parsed', () => {
            const obj = { color: 'blue' };
            const result = AdvancedSelectorMatcher.parseProperties(obj);

            // Should return the same object
            expect(result).toBe(obj);
        });
    });
});

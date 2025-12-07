/**
 * Advanced Selector Matcher Tests
 * Tests for complex CSS selector handling
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AdvancedSelectorMatcher } from '../src/lib/css/AdvancedSelectorMatcher';

describe('AdvancedSelectorMatcher', () => {
    let doc;
    let parser;

    beforeEach(() => {
        parser = new DOMParser();
        doc = parser.parseFromString(`
      <div class="container">
        <h1 id="title">Main Title</h1>
        <p class="intro">Introduction</p>
        <div class="content">
          <p class="text">Content text</p>
          <button disabled>Submit</button>
        </div>
      </div>
    `, 'text/html');
    });

    describe('matches()', () => {
        it('should match simple class selector', () => {
            const container = doc.querySelector('.container');
            expect(AdvancedSelectorMatcher.matches(container, '.container')).toBe(true);
        });

        it('should match ID selector', () => {
            const title = doc.querySelector('h1');
            expect(AdvancedSelectorMatcher.matches(title, '#title')).toBe(true);
        });

        it('should match descendant selector', () => {
            const text = doc.querySelector('.content .text');
            expect(AdvancedSelectorMatcher.matches(text, '.container .text')).toBe(true);
        });

        it('should match child selector', () => {
            const intro = doc.querySelector('.intro');
            expect(AdvancedSelectorMatcher.matches(intro, '.container > .intro')).toBe(true);
        });

        it('should match attribute selector', () => {
            const button = doc.querySelector('button');
            expect(AdvancedSelectorMatcher.matches(button, 'button[disabled]')).toBe(true);
        });

        it('should match pseudo-class selector', () => {
            const firstP = doc.querySelector('p');
            expect(AdvancedSelectorMatcher.matches(firstP, 'p:first-of-type')).toBe(true);
        });

        it('should not match non-matching selector', () => {
            const container = doc.querySelector('.container');
            expect(AdvancedSelectorMatcher.matches(container, '.non-existent')).toBe(false);
        });

        it('should handle invalid selectors gracefully', () => {
            const div = doc.querySelector('div');
            expect(AdvancedSelectorMatcher.matches(div, '???invalid')).toBe(false);
        });
    });

    describe('getSpecificity()', () => {
        it('should calculate ID specificity', () => {
            expect(AdvancedSelectorMatcher.getSpecificity('#id')).toBe(100);
        });

        it('should calculate class specificity', () => {
            expect(AdvancedSelectorMatcher.getSpecificity('.class')).toBe(10);
        });

        it('should calculate element specificity', () => {
            expect(AdvancedSelectorMatcher.getSpecificity('div')).toBe(1);
        });

        it('should calculate combined specificity', () => {
            expect(AdvancedSelectorMatcher.getSpecificity('#id .class div')).toBe(111);
        });

        it('should handle complex selectors', () => {
            const specificity = AdvancedSelectorMatcher.getSpecificity('.container > p.text:first-child');
            expect(specificity).toBeGreaterThan(0);
        });
    });

    describe('analyzeSelector()', () => {
        it('should detect descendant selector', () => {
            const analysis = AdvancedSelectorMatcher.analyzeSelector('.parent .child');
            expect(analysis.hasDescendant).toBe(true);
            expect(analysis.isComplex).toBe(false); // only whitespace
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

    describe('matchWithCascade()', () => {
        it('should apply cascade correctly', () => {
            const cssMap = {
                'p': 'color: black; font-size: 14px;',
                '.text': 'color: blue;',
                '.content .text': 'color: red; font-weight: bold;'
            };

            const textElement = doc.querySelector('.content .text');
            const result = AdvancedSelectorMatcher.matchWithCascade(textElement, cssMap);

            expect(result.appliedProperties.color).toBe('red'); // Most specific wins
            expect(result.appliedProperties['font-size']).toBe('14px');
            expect(result.appliedProperties['font-weight']).toBe('bold');
            expect(result.matchingSelectors).toHaveLength(3);
        });

        it('should respect specificity order', () => {
            const cssMap = {
                'p': 'color: black;',
                '.text': 'color: blue;',
                '#special-text': 'color: green;'
            };

            const docWithId = parser.parseFromString(`
        <p id="special-text" class="text">Test</p>
      `, 'text/html');

            const textElement = docWithId.querySelector('p');
            const result = AdvancedSelectorMatcher.matchWithCascade(textElement, cssMap);

            // ID selector (specificity 100) should win
            expect(result.appliedProperties.color).toBe('green');
        });

        it('should handle empty CSS map', () => {
            const div = doc.querySelector('div');
            const result = AdvancedSelectorMatcher.matchWithCascade(div, {});

            expect(result.matchingSelectors).toHaveLength(0);
            expect(result.appliedProperties).toEqual({});
            expect(result.specificity).toBe(0);
        });
    });

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

    describe('parseProperties()', () => {
        it('should parse CSS properties string', () => {
            const props = AdvancedSelectorMatcher.parseProperties('color: red; font-size: 16px;');
            expect(props.color).toBe('red');
            expect(props['font-size']).toBe('16px');
        });

        it('should handle properties with colons in values', () => {
            const props = AdvancedSelectorMatcher.parseProperties('background: url(http://example.com/img.png);');
            expect(props.background).toBe('url(http://example.com/img.png)');
        });

        it('should return object if already parsed', () => {
            const obj = { color: 'blue' };
            const result = AdvancedSelectorMatcher.parseProperties(obj);
            expect(result).toBe(obj);
        });
    });
});

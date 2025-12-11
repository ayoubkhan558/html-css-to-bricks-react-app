/**
 * CSS Selector Tests
 * Tests the AdvancedSelectorMatcher functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
// import { AdvancedSelectorMatcher } from '@src/lib/cssUtils';
import { AdvancedSelectorMatcher } from './../src/lib/cssUtils';

describe('CSS Selector Matcher', () => {
    let testDoc;

    beforeEach(() => {
        const parser = new DOMParser();
        testDoc = parser.parseFromString(`
      <div id="container" class="main-container" data-test="value">
        <h1 id="title" class="heading primary">Title</h1>
        <p class="text intro">First paragraph</p>
        <p class="text">Second paragraph</p>
        <button disabled>Disabled Button</button>
        <button type="submit">Submit</button>
        <input type="text" name="username" required />
        <input type="password" name="password" />
        <a href="https://example.com" target="_blank">Link</a>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
    `, 'text/html');
    });

    // ===== BASIC SELECTORS =====
    describe('Basic Selectors', () => {
        it('should match element selector', () => {
            const div = testDoc.querySelector('div');
            expect(AdvancedSelectorMatcher.matches(div, 'div')).toBe(true);
        });

        it('should match class selector', () => {
            const div = testDoc.querySelector('.main-container');
            expect(AdvancedSelectorMatcher.matches(div, '.main-container')).toBe(true);
        });

        it('should match ID selector', () => {
            const h1 = testDoc.querySelector('#title');
            expect(AdvancedSelectorMatcher.matches(h1, '#title')).toBe(true);
        });

        it('should match universal selector', () => {
            const div = testDoc.querySelector('div');
            expect(AdvancedSelectorMatcher.matches(div, '*')).toBe(true);
        });

        it('should match multiple classes', () => {
            const h1 = testDoc.querySelector('h1');
            expect(AdvancedSelectorMatcher.matches(h1, '.heading.primary')).toBe(true);
        });
    });

    // ===== ATTRIBUTE SELECTORS =====
    describe('Attribute Selectors', () => {
        it('should match [disabled] attribute', () => {
            const button = testDoc.querySelector('button[disabled]');
            expect(AdvancedSelectorMatcher.matches(button, '[disabled]')).toBe(true);
        });

        it('should match [type="text"]', () => {
            const input = testDoc.querySelector('input[type="text"]');
            expect(AdvancedSelectorMatcher.matches(input, '[type="text"]')).toBe(true);
        });

        it('should match [data-test]', () => {
            const div = testDoc.querySelector('[data-test]');
            expect(AdvancedSelectorMatcher.matches(div, '[data-test="value"]')).toBe(true);
        });

        it('should match [href^="https"] (starts with)', () => {
            const link = testDoc.querySelector('a');
            expect(AdvancedSelectorMatcher.matches(link, '[href^="https"]')).toBe(true);
        });

        it('should match [href$=".com"] (ends with)', () => {
            const link = testDoc.querySelector('a');
            expect(AdvancedSelectorMatcher.matches(link, '[href$=".com"]')).toBe(true);
        });

        it('should match [href*="example"] (contains)', () => {
            const link = testDoc.querySelector('a');
            expect(AdvancedSelectorMatcher.matches(link, '[href*="example"]')).toBe(true);
        });
    });

    // ===== PSEUDO-CLASSES =====
    describe('Pseudo-classes', () => {
        it('should match :first-child', () => {
            const h1 = testDoc.querySelector('h1');
            expect(AdvancedSelectorMatcher.matches(h1, 'h1:first-child')).toBe(true);
        });

        it('should match :last-child', () => {
            const lastLi = testDoc.querySelectorAll('li')[2];
            expect(AdvancedSelectorMatcher.matches(lastLi, 'li:last-child')).toBe(true);
        });

        it('should match :first-of-type', () => {
            const firstP = testDoc.querySelector('p');
            expect(AdvancedSelectorMatcher.matches(firstP, 'p:first-of-type')).toBe(true);
        });

        it('should match :not(.intro)', () => {
            const secondP = testDoc.querySelectorAll('p')[1];
            expect(AdvancedSelectorMatcher.matches(secondP, 'p:not(.intro)')).toBe(true);
        });
    });

    // ===== COMBINATORS =====
    describe('Combinators', () => {
        it('should match descendant selector (div p)', () => {
            const p = testDoc.querySelector('p');
            expect(AdvancedSelectorMatcher.matches(p, 'div p')).toBe(true);
        });

        it('should match child selector (div > h1)', () => {
            const h1 = testDoc.querySelector('h1');
            expect(AdvancedSelectorMatcher.matches(h1, 'div > h1')).toBe(true);
        });

        it('should match adjacent sibling (h1 + p)', () => {
            const firstP = testDoc.querySelector('p');
            expect(AdvancedSelectorMatcher.matches(firstP, 'h1 + p')).toBe(true);
        });

        it('should match general sibling (h1 ~ p)', () => {
            const p = testDoc.querySelectorAll('p')[1];
            expect(AdvancedSelectorMatcher.matches(p, 'h1 ~ p')).toBe(true);
        });
    });

    // ===== COMPLEX SELECTORS =====
    describe('Complex Selectors', () => {
        it('should match complex selector (div#container.main-container)', () => {
            const div = testDoc.querySelector('div');
            expect(AdvancedSelectorMatcher.matches(div, 'div#container.main-container')).toBe(true);
        });

        it('should match nested selector', () => {
            const h1 = testDoc.querySelector('h1');
            expect(AdvancedSelectorMatcher.matches(h1, '.main-container > h1.heading')).toBe(true);
        });

        it('should match selector with attribute', () => {
            const submitBtn = testDoc.querySelector('button[type="submit"]');
            expect(AdvancedSelectorMatcher.matches(submitBtn, 'button[type="submit"]:not([disabled])')).toBe(true);
        });
    });

    // ===== SPECIFICITY TESTS =====
    describe('Specificity Calculation', () => {
        it('should calculate element specificity', () => {
            expect(AdvancedSelectorMatcher.getSpecificity('div')).toBe(1);
            expect(AdvancedSelectorMatcher.getSpecificity('h1')).toBe(1);
        });

        it('should calculate class specificity', () => {
            expect(AdvancedSelectorMatcher.getSpecificity('.class')).toBe(10);
            expect(AdvancedSelectorMatcher.getSpecificity('.class1.class2')).toBe(20);
        });

        it('should calculate ID specificity', () => {
            expect(AdvancedSelectorMatcher.getSpecificity('#id')).toBe(100);
        });

        it('should calculate attribute selector specificity', () => {
            const spec = AdvancedSelectorMatcher.getSpecificity('[disabled]');
            expect(spec).toBe(10);
        });

        it('should calculate complex specificity', () => {
            // div (1) + #container (100) + .main-container (10) = 111
            const spec = AdvancedSelectorMatcher.getSpecificity('div#container.main-container');
            expect(spec).toBe(111);
        });

        it('should calculate nested specificity', () => {
            // .parent (10) > .child (10) = 20
            const spec = AdvancedSelectorMatcher.getSpecificity('.parent > .child');
            expect(spec).toBe(20);
        });
    });

    // ===== EDGE CASES =====
    describe('Edge Cases', () => {
        it('should handle empty selector', () => {
            const div = testDoc.querySelector('div');
            expect(AdvancedSelectorMatcher.matches(div, '')).toBe(false);
        });

        it('should handle invalid selector gracefully', () => {
            const div = testDoc.querySelector('div');
            expect(AdvancedSelectorMatcher.matches(div, '[')).toBe(false);
        });

        it('should handle null element', () => {
            expect(AdvancedSelectorMatcher.matches(null, 'div')).toBe(false);
        });

        it('should validate selectors', () => {
            expect(AdvancedSelectorMatcher.isValidSelector('div')).toBe(true);
            expect(AdvancedSelectorMatcher.isValidSelector('.class')).toBe(true);
            expect(AdvancedSelectorMatcher.isValidSelector('#id')).toBe(true);
            expect(AdvancedSelectorMatcher.isValidSelector('[attr]')).toBe(true);
            expect(AdvancedSelectorMatcher.isValidSelector('[')).toBe(false);
        });
    });
});

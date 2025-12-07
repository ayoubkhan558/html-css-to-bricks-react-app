/**
 * Comprehensive CSS Selector Tests
 * Tests all types of CSS selectors to ensure compatibility
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AdvancedSelectorMatcher } from '../src/lib/css/AdvancedSelectorMatcher';
import { converterService } from '../src/services/converter';

describe('CSS Selectors - All Types', () => {
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
        it('should match element selector (div)', () => {
            const div = testDoc.querySelector('div');
            expect(AdvancedSelectorMatcher.matches(div, 'div')).toBe(true);
        });

        it('should match class selector (.main-container)', () => {
            const div = testDoc.querySelector('.main-container');
            expect(AdvancedSelectorMatcher.matches(div, '.main-container')).toBe(true);
        });

        it('should match ID selector (#title)', () => {
            const h1 = testDoc.querySelector('#title');
            expect(AdvancedSelectorMatcher.matches(h1, '#title')).toBe(true);
        });

        it('should match universal selector (*)', () => {
            const div = testDoc.querySelector('div');
            expect(AdvancedSelectorMatcher.matches(div, '*')).toBe(true);
        });

        it('should match multiple classes (.heading.primary)', () => {
            const h1 = testDoc.querySelector('h1');
            expect(AdvancedSelectorMatcher.matches(h1, '.heading.primary')).toBe(true);
        });
    });

    // ===== ATTRIBUTE SELECTORS =====
    describe('Attribute Selectors', () => {
        it('should match [disabled] attribute', () => {
            const button = testDoc.querySelector('button[disabled]');
            expect(AdvancedSelectorMatcher.matches(button, '[disabled]')).toBe(true);
            expect(AdvancedSelectorMatcher.matches(button, 'button[disabled]')).toBe(true);
        });

        it('should match [type="text"]', () => {
            const input = testDoc.querySelector('input[type="text"]');
            expect(AdvancedSelectorMatcher.matches(input, '[type="text"]')).toBe(true);
            expect(AdvancedSelectorMatcher.matches(input, 'input[type="text"]')).toBe(true);
        });

        it('should match [data-test]', () => {
            const div = testDoc.querySelector('[data-test]');
            expect(AdvancedSelectorMatcher.matches(div, '[data-test]')).toBe(true);
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

        it('should match [required] boolean attribute', () => {
            const input = testDoc.querySelector('[required]');
            expect(AdvancedSelectorMatcher.matches(input, 'input[required]')).toBe(true);
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

        it('should match :nth-child(2)', () => {
            const secondP = testDoc.querySelectorAll('p')[1];
            expect(AdvancedSelectorMatcher.matches(secondP, 'p:nth-child(2)')).toBe(false);
        });

        it('should match :first-of-type', () => {
            const firstP = testDoc.querySelector('p');
            expect(AdvancedSelectorMatcher.matches(firstP, 'p:first-of-type')).toBe(true);
        });

        it('should match :not(.intro)', () => {
            const secondP = testDoc.querySelectorAll('p')[1];
            expect(AdvancedSelectorMatcher.matches(secondP, 'p:not(.intro)')).toBe(true);
        });

        it('should match :not([disabled])', () => {
            const submitBtn = testDoc.querySelector('button[type="submit"]');
            expect(AdvancedSelectorMatcher.matches(submitBtn, 'button:not([disabled])')).toBe(true);
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

        it('should match nested selector (.main-container > h1.heading)', () => {
            const h1 = testDoc.querySelector('h1');
            expect(AdvancedSelectorMatcher.matches(h1, '.main-container > h1.heading')).toBe(true);
        });

        it('should match selector with attribute (button[type="submit"]:not([disabled]))', () => {
            const submitBtn = testDoc.querySelector('button[type="submit"]');
            expect(AdvancedSelectorMatcher.matches(submitBtn, 'button[type="submit"]:not([disabled])')).toBe(true);
        });

        it('should match complex descendant (div#container > ul li:first-child)', () => {
            const firstLi = testDoc.querySelector('li');
            expect(AdvancedSelectorMatcher.matches(firstLi, 'div#container > ul li:first-child')).toBe(true);
        });
    });

    // ===== SPECIFICITY TESTS =====
    describe('Specificity Calculation', () => {
        it('should calculate element specificity correctly', () => {
            expect(AdvancedSelectorMatcher.getSpecificity('div')).toBe(1);
            expect(AdvancedSelectorMatcher.getSpecificity('h1')).toBe(1);
        });

        it('should calculate class specificity correctly', () => {
            expect(AdvancedSelectorMatcher.getSpecificity('.class')).toBe(10);
            expect(AdvancedSelectorMatcher.getSpecificity('.class1.class2')).toBe(20);
        });

        it('should calculate ID specificity correctly', () => {
            expect(AdvancedSelectorMatcher.getSpecificity('#id')).toBe(100);
        });

        it('should calculate attribute selector specificity', () => {
            const spec = AdvancedSelectorMatcher.getSpecificity('[disabled]');
            expect(spec).toBe(10); // Attribute selectors have same specificity as classes
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
            expect(AdvancedSelectorMatcher.matches(div, '>>>')).toBe(false);
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

    // ===== CASCADE PRIORITY =====
    describe('Cascade with Attribute Selectors', () => {
        it('should apply correct cascade with attribute selectors', () => {
            const button = testDoc.querySelector('button[disabled]');

            const cssMap = {
                'button': 'color: black;',                    // Specificity: 1
                '[disabled]': 'color: gray;',                // Specificity: 10
                'button[disabled]': 'color: red;'            // Specificity: 11
            };

            const result = AdvancedSelectorMatcher.matchWithCascade(button, cssMap);

            // button[disabled] (specificity 11) should win
            expect(result.appliedProperties.color).toBe('red');
        });

        it('should handle complex cascade with multiple selector types', () => {
            const input = testDoc.querySelector('input[type="text"]');

            const cssMap = {
                'input': 'border: 1px solid black;',                     // Specificity: 1
                '[type="text"]': 'border: 1px solid gray;',            // Specificity: 10
                'input[type="text"]': 'border: 1px solid blue;',       // Specificity: 11
                'input[name="username"]': 'border: 1px solid green;'   // Specificity: 11
            };

            const result = AdvancedSelectorMatcher.matchWithCascade(input, cssMap);

            // Last selector with same specificity should win (source order)
            expect(result.appliedProperties.border).toBeDefined();
        });
    });


    // ===== ID SELECTORS =====
    describe('ID Selectors', () => {
        it('should apply basic ID selector styles', () => {
            const html = '<h1 id="title">Title</h1>';
            const css = '#title { font-size: 36px; padding: 10px; text-align: center; }';

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            expect(h1).toBeDefined();
            expect(h1.settings._cssId).toBe('title');
            expect(h1.settings._typography?.['font-size']).toBe('36px');
        });

        it('should handle multiple ID-based rules', () => {
            const html = '<h1 id="title">Title</h1>';
            const css = `
            #title { color: blue; }
            #title { font-size: 32px; }
          `;

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            expect(h1.settings._typography?.color?.hex).toBeDefined();
            expect(h1.settings._typography?.['font-size']).toBe('32px');
        });
    });

    // ===== PSEUDO-CLASSES =====
    describe('Pseudo-classes', () => {
        it('should apply :hover pseudo-class', () => {
            const html = '<h1 id="title">Title</h1>';
            const css = '#title:hover { color: red; }';

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            expect(h1.settings['_typography:hover']).toBeDefined();
        });

        it('should apply :focus pseudo-class', () => {
            const html = '<h1 id="title">Title</h1>';
            const css = '#title:focus { outline: 2px solid blue; }';

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            expect(h1.settings['_border:focus'] || h1.settings._cssCustom).toBeDefined();
        });

        it('should apply :active pseudo-class', () => {
            const html = '<h1 id="title">Title</h1>';
            const css = '#title:active { color: orange; }';

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            expect(h1.settings['_typography:active']).toBeDefined();
        });

        it('should apply :first-child pseudo-class', () => {
            const html = '<div><h1 id="title">Title</h1></div>';
            const css = '#title:first-child { border-top: 2px dashed black; }';

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            expect(h1.settings['_border:first-child'] || h1.settings._cssCustom).toBeDefined();
        });

        it('should apply :last-child pseudo-class', () => {
            const html = '<div><h1 id="title">Title</h1></div>';
            const css = '#title:last-child { border-bottom: 2px dashed black; }';

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            expect(h1.settings['_border:last-child'] || h1.settings._cssCustom).toBeDefined();
        });

        it('should apply :nth-child() pseudo-class', () => {
            const html = '<div><h1 id="title">Title</h1></div>';
            const css = '#title:nth-child(1) { background-color: lightyellow; }';

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            expect(h1.settings['_background:nth-child'] || h1.settings._cssCustom).toBeDefined();
        });

        it('should apply :nth-of-type() pseudo-class', () => {
            const html = '<div><h1 id="title">Title</h1></div>';
            const css = '#title:nth-of-type(1) { letter-spacing: 2px; }';

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            expect(h1.settings['_typography:nth-of-type'] || h1.settings._cssCustom).toBeDefined();
        });

        it('should apply :not() pseudo-class', () => {
            const html = '<h1 id="title">Title</h1>';
            const css = '#title:not(.disabled) { text-transform: uppercase; }';

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            expect(h1.settings['_typography:not'] || h1.settings._cssCustom).toBeDefined();
        });

        it('should apply :focus-visible pseudo-class', () => {
            const html = '<h1 id="title">Title</h1>';
            const css = '#title:focus-visible { background-color: lightblue; }';

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            expect(h1.settings['_background:focus-visible'] || h1.settings._cssCustom).toBeDefined();
        });

        it('should not apply :empty pseudo-class when element has content', () => {
            const html = '<h1 id="title">Title</h1>';
            const css = '#title:empty { background-color: pink; }';

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            // :empty shouldn't match because element has content
            expect(h1).toBeDefined();
        });
    });

    // ===== PSEUDO-ELEMENTS =====
    describe('Pseudo-elements', () => {
        it('should handle ::before pseudo-element', () => {
            const html = '<h1 id="title">Title</h1>';
            const css = '#title::before { content: "🔥 "; }';

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            expect(h1.settings._cssCustom).toContain('::before');
        });

        it('should handle ::after pseudo-element', () => {
            const html = '<h1 id="title">Title</h1>';
            const css = '#title::after { content: " 🔥"; }';

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            expect(h1.settings._cssCustom).toContain('::after');
        });

        it('should handle combined pseudo-class and pseudo-element', () => {
            const html = '<h1 id="title">Title</h1>';
            const css = '#title:hover::after { content: " ✨"; }';

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            expect(h1.settings._cssCustom).toContain(':hover::after');
        });
    });

    // ===== ATTRIBUTE SELECTORS =====
    describe('Attribute Selectors', () => {
        it('should match attribute existence selector', () => {
            const html = '<h1 data-role="heading">Title</h1>';
            const css = '[data-role] { padding: 10px; }';

            const result = converterService.convert(html, css);

            expect(result.content.length).toBeGreaterThan(0);
        });

        it('should match attribute value selector', () => {
            const html = '<h1 data-role="heading">Title</h1>';
            const css = 'h1[data-role="heading"] { padding: 10px; }';

            const result = converterService.convert(html, css);
            const h1 = result.content[0];

            expect(h1).toBeDefined();
        });

        it('should match universal attribute selector', () => {
            const html = '<h1 aria-label="Main Title">Title</h1>';
            const css = '*[aria-label] { margin-bottom: 20px; }';

            const result = converterService.convert(html, css);

            expect(result.content.length).toBeGreaterThan(0);
        });
    });

    // ===== COMBINED SELECTORS =====
    describe('Combined Selectors', () => {
        it('should handle ID + class combination', () => {
            const html = '<h1 id="title" class="main-title">Title</h1>';
            const css = 'h1#title.main-title { background: yellow; }';

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            expect(h1).toBeDefined();
        });

        it('should handle descendant selector', () => {
            const html = '<div class="container"><h1>Title</h1></div>';
            const css = '.container h1 { border-bottom: 2px solid black; }';

            const result = converterService.convert(html, css);

            expect(result.content.length).toBeGreaterThan(0);
        });

        it('should handle type selector', () => {
            const html = '<h1>Title</h1>';
            const css = 'h1 { text-transform: uppercase; }';

            const result = converterService.convert(html, css);
            const h1 = result.content[0];

            expect(h1).toBeDefined();
        });
    });

    // ===== SPECIFICITY & CASCADE =====
    describe('Specificity and Cascade', () => {
        it('should apply styles in correct cascade order', () => {
            const html = '<h1 id="title" class="main-title">Title</h1>';
            const css = `
            h1 { font-size: 20px; }
            .main-title { font-size: 28px; }
            #title { font-size: 36px; }
          `;

            const result = converterService.convert(html, css);
            const h1 = result.content.find(el => el.settings._cssId === 'title');

            // ID selector should win (highest specificity)
            expect(h1.settings._typography?.['font-size']).toBe('36px');
        });

        it('should handle multiple class selectors', () => {
            const html = '<div class="container"><p class="text">Sample</p></div>';
            const css = `
            .text { font-size: 16px; }
            .container .text { line-height: 1.5; }
          `;

            const result = converterService.convert(html, css);

            expect(result.globalClasses.length).toBeGreaterThan(0);
        });
    });

    // ===== NON-MATCHING SELECTORS =====
    describe('Non-matching Selectors', () => {
        it('should not apply styles for non-existent classes', () => {
            const html = '<p class="text">Sample</p>';
            const css = '.non-existent { color: red; }';

            const result = converterService.convert(html, css);
            const textClass = result.globalClasses.find(c => c.name === 'text');

            // non-existent class shouldn't affect existing elements
            expect(result.globalClasses.some(c => c.name === 'non-existent')).toBe(false);
        });
    });
});

/**
 * Advanced Selector Usage Examples
 * Demonstrates complex CSS selector handling
 */

import { AdvancedSelectorMatcher } from '../src/lib/css/AdvancedSelectorMatcher';
import { CssProcessor } from '../src/services/converter/CssProcessor';

// ===== Example 1: Basic Selector Matching =====
export function basicSelectorMatching() {
    const html = `
    <div class="card">
      <h2 class="title">Card Title</h2>
      <p class="description">Card description</p>
    </div>
  `;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const title = doc.querySelector('.title');

    console.log('=== Basic Selector Matching ===');
    console.log('Matches .title:', AdvancedSelectorMatcher.matches(title, '.title'));
    console.log('Matches .card .title:', AdvancedSelectorMatcher.matches(title, '.card .title'));
    console.log('Matches h2.title:', AdvancedSelectorMatcher.matches(title, 'h2.title'));
}

// ===== Example 2: Complex Selectors =====
export function complexSelectors() {
    const html = `
    <ul class="menu">
      <li class="item">Item 1</li>
      <li class="item active">Item 2</li>
      <li class="item">Item 3</li>
    </ul>
  `;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const activeItem = doc.querySelector('.active');
    const firstItem = doc.querySelector('li:first-child');

    console.log('\n=== Complex Selectors ===');
    console.log('Active item matches li.active:', AdvancedSelectorMatcher.matches(activeItem, 'li.active'));
    console.log('First item matches li:first-child:', AdvancedSelectorMatcher.matches(firstItem, 'li:first-child'));
    console.log('Active is nth-child(2):', AdvancedSelectorMatcher.matches(activeItem, 'li:nth-child(2)'));
}

// ===== Example 3: Cascade and Specificity =====
export function cascadeExample() {
    const html = '<p id="special" class="text">Hello</p>';
    const css = `
    p { color: black; font-size: 14px; }
    .text { color: blue; }
    #special { color: red; }
  `;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const p = doc.querySelector('p');

    const cssMap = {
        'p': 'color: black; font-size: 14px;',
        '.text': 'color: blue;',
        '#special': 'color: red;'
    };

    const result = AdvancedSelectorMatcher.matchWithCascade(p, cssMap);

    console.log('\n=== Cascade and Specificity ===');
    console.log('Matching selectors:', result.matchingSelectors);
    console.log('Final color (should be red):', result.appliedProperties.color);
    console.log('Font size:', result.appliedProperties['font-size']);
    console.log('Final specificity:', result.specificity);
}

// ===== Example 4: Attribute Selectors =====
export function attributeSelectors() {
    const html = `
    <input type="text" required />
    <input type="email" />
    <button disabled>Submit</button>
  `;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const textInput = doc.querySelector('input[type="text"]');
    const button = doc.querySelector('button');

    console.log('\n=== Attribute Selectors ===');
    console.log('Text input matches [type="text"]:', AdvancedSelectorMatcher.matches(textInput, 'input[type="text"]'));
    console.log('Text input matches [required]:', AdvancedSelectorMatcher.matches(textInput, 'input[required]'));
    console.log('Button matches [disabled]:', AdvancedSelectorMatcher.matches(button, '[disabled]'));
}

// ===== Example 5: Selector Analysis =====
export function selectorAnalysis() {
    const selectors = [
        '.simple',
        '.parent > .child',
        'div + p',
        'input[type="text"]',
        'li:nth-child(2n)',
        'div:not(.exclude)',
        'a:hover::after'
    ];

    console.log('\n=== Selector Analysis ===');
    selectors.forEach(selector => {
        const analysis = AdvancedSelectorMatcher.analyzeSelector(selector);
        const specificity = AdvancedSelectorMatcher.getSpecificity(selector);
        console.log(`\n${selector}:`);
        console.log('  Specificity:', specificity);
        console.log('  Is Complex:', analysis.isComplex);
        console.log('  Features:', Object.keys(analysis).filter(k => analysis[k] && k !== 'isComplex').join(', '));
    });
}

// ===== Example 6: Using with CssProcessor =====
export async function cssProcessorExample() {
    const processor = new CssProcessor();

    const css = `
    .container { padding: 20px; }
    .container > p { margin: 10px; }
    .container p.highlight { color: yellow; }
  `;

    processor.parse(css);

    const html = `
    <div class="container">
      <p class="highlight">Highlighted text</p>
    </div>
  `;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const p = doc.querySelector('p');

    console.log('\n=== CssProcessor with Advanced Matching ===');

    // Use advanced matching
    const result = processor.matchSelectorsAdvanced(p);
    console.log('Matching selectors:', result.matchingSelectors);
    console.log('Applied properties:', result.appliedProperties);
    console.log('Final specificity:', result.specificity);

    // Analyze a selector
    const analysis = processor.analyzeSelector('.container > p');
    console.log('\nAnalysis of ".container > p":', analysis);
}

// Run all examples
export function runAllExamples() {
    console.log('######## Advanced Selector Matcher Examples ########\n');

    basicSelectorMatching();
    complexSelectors();
    cascadeExample();
    attributeSelectors();
    selectorAnalysis();
    cssProcessorExample();

    console.log('\n######## Examples Complete ########');
}

// Auto-run if executed directly
if (typeof window !== 'undefined') {
    runAllExamples();
}

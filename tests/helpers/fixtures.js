/**
 * Test Fixtures
 * 
 * This file contains reusable test data (fixtures) that can be used across
 * multiple test files. Fixtures help keep tests DRY (Don't Repeat Yourself)
 * and make it easier to maintain test data in one place.
 */

/**
 * Sample HTML snippets for testing
 * Each fixture represents a common HTML pattern
 */
export const HTML_FIXTURES = {
    // Simple single element
    simpleDiv: '<div>Hello World</div>',

    // Heading elements
    heading: '<h1>Main Title</h1>',
    headingWithClass: '<h2 class="title">Subtitle</h2>',
    headingWithStyles: '<h3 style="color: red; font-size: 24px;">Styled Heading</h3>',

    // Text elements
    paragraph: '<p>This is a paragraph.</p>',
    paragraphWithClass: '<p class="intro">Introduction text</p>',

    // Button elements
    button: '<button>Click Me</button>',
    buttonDisabled: '<button disabled>Disabled Button</button>',

    // Complex nested structure
    nestedDiv: `
    <div class="container">
      <h1>Title</h1>
      <p>Content</p>
      <button>Action</button>
    </div>
  `,

    // List elements
    unorderedList: `
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  `,

    // Table element
    simpleTable: `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John</td>
          <td>30</td>
        </tr>
      </tbody>
    </table>
  `,

    // Form elements
    form: `
    <form>
      <input type="text" name="username" />
      <input type="password" name="password" />
      <button type="submit">Submit</button>
    </form>
  `,

    // Image element
    image: '<img src="test.jpg" alt="Test Image" />',

    // Link element
    link: '<a href="https://example.com">Click here</a>',

    // SVG element
    svg: `
    <svg width="100" height="100">
      <circle cx="50" cy="50" r="40" fill="blue" />
    </svg>
  `
};

/**
 * Sample CSS snippets for testing
 */
export const CSS_FIXTURES = {
    // Simple class
    simpleClass: '.box { padding: 20px; }',

    // Multiple classes
    multipleClasses: `
    .container { max-width: 1200px; }
    .title { font-size: 24px; }
    .button { background: blue; }
  `,

    // CSS with variables
    withVariables: `
    :root {
      --primary-color: #3498db;
      --spacing: 16px;
    }
    .box {
      color: var(--primary-color);
      padding: var(--spacing);
    }
  `,

    // Complex selectors
    complexSelectors: `
    .container > .child { margin: 10px; }
    .parent .descendant { padding: 5px; }
    button:hover { background: red; }
    li:first-child { font-weight: bold; }
  `,

    // Media queries
    withMediaQuery: `
    .box { width: 100%; }
    @media (min-width: 768px) {
      .box { width: 50%; }
    }
  `,

    // Keyframes
    withKeyframes: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .fade { animation: fadeIn 1s; }
  `
};

/**
 * Sample JavaScript snippets for testing
 */
export const JS_FIXTURES = {
    simpleLog: 'console.log("Hello");',

    eventListener: `
    document.querySelector('.button').addEventListener('click', function() {
      alert('Clicked!');
    });
  `,

    multiLine: `
    function init() {
      console.log('Initialized');
      setupEventListeners();
    }
    init();
  `
};

/**
 * Expected Bricks element structures
 * These represent what we expect the converter to produce
 */
export const EXPECTED_BRICKS = {
    // Expected structure for a heading element
    heading: {
        name: 'heading',
        settings: {
            tag: 'h1',
            text: 'Main Title'
        }
    },

    // Expected structure for a button
    button: {
        name: 'button',
        settings: {
            text: 'Click Me',
            style: 'primary'
        }
    },

    // Expected structure for a paragraph
    paragraph: {
        name: 'text-basic',
        settings: {
            tag: 'p',
            text: 'This is a paragraph.'
        }
    }
};

/**
 * Helper function to create a DOM element from HTML string
 * Useful for testing DOM manipulation
 * 
 * @param {string} html - HTML string
 * @returns {Element} - DOM element
 */
export function createElementFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.firstElementChild;
}

/**
 * Helper function to create a full document from HTML
 * 
 * @param {string} html - HTML string
 * @returns {Document} - DOM document
 */
export function createDocumentFromHTML(html) {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
}

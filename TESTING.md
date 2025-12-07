# Testing Guide

## Simple Test Structure

```
tests/
├── selector.test.js      # CSS selector tests
├── converter.test.js     # HTML/CSS/JS conversion tests
├── processor.test.js     # Element processor tests
├── integration.test.js   # Full pipeline tests
└── helpers.js            # Shared utilities
```

## Run Tests

```bash
npm test                  # Watch mode
npm run test:run          # Run once
npm run test:coverage     # With coverage
```

## Writing Tests

Each test file is simple and follows this pattern:

```javascript
import { describe, it, expect } from 'vitest';

describe('Feature', () => {
  // TEST: What does this test?
  it('should do something', () => {
    // Setup
    const input = 'test';
    
    // Execute
    const result = doSomething(input);
    
    // Verify
    expect(result).toBe('expected');
  });
});
```

## Helper Functions

```javascript
import { html, doc, isBricksStructure } from './helpers';

// Create element
const div = html('<div>Content</div>');

// Create document
const document = doc('<div><p>Text</p></div>');

// Check Bricks structure
isBricksStructure(result);
```

That's it! Keep tests simple and focused.

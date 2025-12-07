# Brickify Testing Guide

## 📚 Understanding the Test Suite

This guide explains how our tests are organized and how to write new tests.

---

## 🗂️ Test Structure

```
tests/
├── setup.js                    # Global test configuration
├── helpers/                    # Shared test utilities
│   ├── fixtures.js            # Sample HTML/CSS/JS data
│   └── assertions.js          # Custom test assertions
├── unit/                       # Unit tests (test one thing)
│   ├── lib/                   # Library tests
│   ├── services/              # Service tests
│   └── processors/            # Processor tests
├── integration/                # Integration tests (test multiple things together)
│   └── full-conversion.test.js
└── examples/                   # Usage examples
```

---

## 🧪 Types of Tests

### Unit Tests
Test individual functions/classes in isolation.

**Example:** Testing if `HeadingProcessor` correctly converts an `<h1>` tag.

**Location:** `tests/unit/`

### Integration Tests
Test multiple components working together.

**Example:** Testing if HTML + CSS + JS converts correctly through the entire pipeline.

**Location:** `tests/integration/`

---

## 🚀 Running Tests

```bash
# Run all tests in watch mode (recommended for development)
npm test

# Run tests once (for CI/CD)
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test tests/unit/services/converter.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="should convert"
```

---

## ✍️ Writing Tests

### Basic Test Structure

```javascript
import { describe, it, expect } from 'vitest';

// describe() groups related tests together
describe('MyFunction', () => {
  
  // it() defines a single test case
  it('should do something specific', () => {
    // Arrange: Set up test data
    const input = 'test';
    
    // Act: Call the function
    const result = myFunction(input);
    
    // Assert: Check the result
    expect(result).toBe('expected');
  });
});
```

### Using Fixtures

Instead of repeating HTML/CSS in every test, use fixtures:

```javascript
import { HTML_FIXTURES } from '../helpers/fixtures';

it('should convert heading', () => {
  const result = convert(HTML_FIXTURES.heading);
  expect(result).toBeDefined();
});
```

### Using Custom Assertions

Use our custom assertions for cleaner tests:

```javascript
import { assertBricksStructure, findElementByName } from '../helpers/assertions';

it('should create valid structure', () => {
  const result = converter.convert(html);
  
  // Instead of multiple expect() calls, use custom assertion
  assertBricksStructure(result);
  
  // Find elements easily
  const heading = findElementByName(result.content, 'heading');
  expect(heading.settings.text).toBe('Title');
});
```

### Setup and Teardown

Use `beforeEach()` to set up test data:

```javascript
describe('MyTests', () => {
  let converter;
  
  // Runs before each test
  beforeEach(() => {
    converter = new ConverterService();
  });
  
  it('test 1', () => {
    // converter is fresh for this test
  });
  
  it('test 2', () => {
    // converter is fresh again
  });
});
```

---

## 📖 Reading Test Output

### Passing Test
```
✓ should convert heading (5ms)
```

### Failing Test
```
✗ should convert heading (10ms)
  Expected: "heading"
  Received: "div"
```

### Test Coverage
```
Coverage Summary:
  Statements: 85%
  Branches: 78%
  Functions: 90%
  Lines: 85%
```

---

## 💡 Best Practices

### 1. **One Thing Per Test**
```javascript
// ❌ Bad: Testing multiple things
it('should convert and validate', () => {
  const result = convert(html);
  expect(result.content).toBeDefined();
  expect(result.version).toBe('2.1.4');
  expect(result.globalClasses).toHaveLength(3);
});

// ✅ Good: One assertion per test
it('should have content', () => {
  const result = convert(html);
  expect(result.content).toBeDefined();
});

it('should have correct version', () => {
  const result = convert(html);
  expect(result.version).toBe('2.1.4');
});
```

### 2. **Descriptive Test Names**
```javascript
// ❌ Bad
it('works', () => { ... });

// ✅ Good
it('should convert h1 element to heading with correct text', () => { ... });
```

### 3. **Use Comments**
```javascript
it('should handle cascade', () => {
  // Setup: Create CSS with different specificity levels
  const css = { ... };
  
  // Act: Match selectors
  const result = matcher.matchWithCascade(element, css);
  
  // Assert: Most specific selector should win
  expect(result.appliedProperties.color).toBe('red');
});
```

### 4. **Test Edge Cases**
```javascript
it('should handle empty input', () => { ... });
it('should handle null input', () => { ... });
it('should handle malformed HTML', () => { ... });
```

---

## 🔍 Common Assertions

```javascript
// Equality
expect(value).toBe(expected);           // Strict equality (===)
expect(value).toEqual(expected);        // Deep equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeDefined();
expect(value).toBeNull();

// Numbers
expect(value).toBeGreaterThan(5);
expect(value).toBeLessThan(10);

// Strings
expect(string).toContain('substring');
expect(string).toMatch(/regex/);

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain(item);

// Objects
expect(object).toHaveProperty('key');
expect(object).toHaveProperty('key', 'value');

// Errors
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('error message');
```

---

## 🐛 Debugging Tests

### 1. Use console.log
```javascript
it('should work', () => {
  const result = convert(html);
  console.log('Result:', JSON.stringify(result, null, 2));
  expect(result).toBeDefined();
});
```

### 2. Run Single Test
```bash
npm test -- --testNamePattern="specific test name"
```

### 3. Use Vitest UI
```bash
npm run test:ui
```
Opens a browser UI where you can see test results visually.

---

## 📝 Example: Writing a New Test

Let's say you added a new `VideoProcessor`. Here's how to test it:

```javascript
// tests/unit/processors/video.test.js
import { describe, it, expect } from 'vitest';
import { VideoProcessor } from '../../../src/processors/VideoProcessor';
import { createElementFromHTML } from '../../helpers/fixtures';
import { assertBricksElement } from '../../helpers/assertions';

describe('VideoProcessor', () => {
  let processor;

  beforeEach(() => {
    processor = new VideoProcessor();
  });

  it('should process video element', () => {
    // Arrange
    const video = createElementFromHTML('<video src="video.mp4"></video>');
    
    // Act
    const result = processor.process(video);
    
    // Assert
    assertBricksElement(result);
    expect(result.name).toBe('video');
    expect(result.settings.url).toBe('video.mp4');
  });

  it('should handle video with controls', () => {
    const video = createElementFromHTML('<video src="video.mp4" controls></video>');
    const result = processor.process(video);
    
    expect(result.settings.controls).toBe(true);
  });
});
```

---

## 🎯 Test Coverage Goals

- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 85%
- **Lines:** > 80%

Run `npm run test:coverage` to check current coverage.

---

## 🆘 Getting Help

If tests are failing:

1. Read the error message carefully
2. Check if fixtures/assertions are imported correctly
3. Verify import paths are correct
4. Run tests with `--verbose` flag
5. Use `console.log` to debug

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [AAA Pattern](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/)

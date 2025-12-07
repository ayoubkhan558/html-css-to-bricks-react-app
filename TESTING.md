# Brickify Testing Guide

## Running Tests

Brickify uses [Vitest](https://vitest.dev/) for unit and integration testing.

### Available Test Commands

```bash
# Run tests in watch mode (recommended for development)
npm test

# Run tests once (for CI)
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

```
tests/
├── setup.js                              # Global test setup
├── AdvancedSelectorMatcher.test.js       # Selector tests
├── examples/                             # Usage examples
│   └── AdvancedSelectors.examples.js
└── ...                                   # Other tests
```

### Writing Tests

Tests use Vitest's describe/it/expect syntax:

```javascript
import { describe, it, expect } from 'vitest';
import { MyClass } from '../src/MyClass';

describe('MyClass', () => {
  it('should do something', () => {
    const result = MyClass.doSomething();
    expect(result).toBe(true);
  });
});
```

### Test Coverage

Generate coverage reports with:

```bash
npm run test:coverage
```

Coverage reports will be in the `coverage/` directory.

### Running Specific Tests

```bash
# Run tests matching a pattern
npx vitest run --testNamePattern="AdvancedSelector"

# Run a specific test file
npx vitest run tests/AdvancedSelectorMatcher.test.js
```

---

## Examples

Example files demonstrate how to use various features:

```bash
# Run examples
node tests/examples/AdvancedSelectors.examples.js
```

### Available Examples

1. **AdvancedSelectors.examples.js** - CSS selector matching demos
   - Basic selector matching
   - Complex selectors (child, descendant, attribute)
   - Cascade and specificity
   - Selector analysis

---

## Test Categories

### Unit Tests
Test individual functions/classes in isolation.

**Location:** `tests/*.test.js`

### Integration Tests
Test multiple components working together.

**Location:** `tests/integration/*.test.js`

### Examples
Runnable demonstrations of features.

**Location:** `tests/examples/*.examples.js`

---

## Continuous Integration

Tests automatically run on:
- Push to main branch
- Pull requests
- Pre-commit hooks (if configured)

---

## Troubleshooting

### Tests failing locally but passing in CI
- Clear node_modules and reinstall: `npm ci`
- Check Node.js version matches CI

### DOM-related errors
- Ensure jsdom is installed: `npm install -D jsdom`
- Check test environment in vitest.config.js

### Import errors
- Verify path aliases in vitest.config.js
- Use absolute imports or configure "@" alias

---

## Best Practices

1. ✅ **Write tests first** (TDD approach)
2. ✅ **Test one thing** per test case
3. ✅ **Use descriptive names** for test cases
4. ✅ **Mock external dependencies** when appropriate
5. ✅ **Clean up** after tests (reset states)
6. ✅ **Aim for high coverage** (>80%)

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

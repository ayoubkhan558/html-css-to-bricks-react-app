/**
 * Integration Guide
 * How to migrate from old architecture to new architecture
 */

# Brickify Architecture Migration Guide

## Overview

This guide explains how to migrate from the old monolithic architecture to the new modular, service-based architecture.

---

## Architecture Comparison

### Old Architecture
```javascript
// Direct import of monolithic functions
import { convertHtmlToBricks } from './Generator/utils/domToBricks';
import { createAiService } from './Generator/utils/openaiService';

// Usage
const result = convertHtmlToBricks(html, css, options);
```

### New Architecture
```javascript
// Import services
import { converterService } from './services/converter';
import { aiService } from './services/ai';

// Usage
const result = converterService.convert(html, css, js, options);
```

---

## Migration Steps

### Step 1: Update Imports in React Components

**Before:**
```javascript
import { convertHtmlToBricks } from '../Generator/utils/domToBricks';
```

**After:**
```javascript
import { converterService } from '../services/converter';
```

### Step 2: Update Function Calls

**Before:**
```javascript
const bricksJson = convertHtmlToBricks(html, css, {
  context: {
    inlineStyleHandling: 'class',
    showNodeClass: false
  }
});
```

**After:**
```javascript
const bricksJson = converterService.convert(html, css, js, {
  inlineStyleHandling: 'class',
  showNodeClass: false
});
```

Note: Options are flattened (no `context` wrapper needed).

### Step 3: Update AI Integration

**Before:**
```javascript
import { generateWithAI } from '../Generator/utils/openaiService';

const { html, css, js } = await generateWithAI(prompt, provider, apiKey);
```

**After:**
```javascript
import { aiService } from '../services/ai';

aiService.configure('gemini', apiKey);
const { html, css, js } = await aiService.generate(prompt);
```

---

## Component Migration Example

### Old GeneratorComponent.jsx

```javascript
import { convertHtmlToBricks } from '../Generator/utils/domToBricks';

function GeneratorComponent() {
  const handleConvert = () => {
    const result = convertHtmlToBricks(html, css, {
      context: {
        inlineStyleHandling: styleMode,
        showNodeClass: showLabels
      }
    });
    
    setOutput(JSON.stringify(result, null, 2));
  };
  
  return (/* JSX */);
}
```

### New GeneratorComponent.jsx

```javascript
import { converterService } from '../services/converter';

function GeneratorComponent() {
  const handleConvert = () => {
    const result = converterService.convert(html, css, js, {
      inlineStyleHandling: styleMode,
      showNodeClass: showLabels
    });
    
    setOutput(JSON.stringify(result, null, 2));
  };
  
  return (/* JSX */);
}
```

---

## Benefits of New Architecture

### 1. **Separation of Concerns**
- DOM parsing logic separated from CSS processing
- Element processing isolated in dedicated processors
- Clear service boundaries

### 2. **Testability**
- Each service can be tested independently
- Mock services easily for unit tests
- Comprehensive test coverage

### 3. **Extensibility**
- Add new processors without touching core code
- Plugin-like architecture for future features
- Easy to add new AI providers

### 4. **Maintainability**
- Smaller, focused modules
- Clear dependencies
- Self-documenting code structure

### 5. **Performance**
- Services can be optimized independently
- Lazy loading potential
- Better code splitting

---

## Gradual Migration Strategy

You don't need to migrate everything at once. Here's a gradual approach:

### Phase 1: Parallel Run (Both Systems Active)
1. Keep old code in place
2. Import new services alongside old functions
3. Add feature flag to switch between old/new

```javascript
const USE_NEW_ARCHITECTURE = true;

const result = USE_NEW_ARCHITECTURE
  ? converterService.convert(html, css, js, options)
  : convertHtmlToBricks(html, css, { context: options });
```

### Phase 2: Test & Validate
1. Run tests on new architecture
2. Compare outputs between old and new
3. Fix any discrepancies

### Phase 3: Full Migration
1. Remove feature flags
2. Delete old code
3. Update all imports

### Phase 4: Cleanup
1. Remove unused files
2. Update documentation
3. Celebrate! 🎉

---

## Breaking Changes

### Options Object Structure

**Old:**
```javascript
{
  context: {
    inlineStyleHandling: 'class',
    showNodeClass: false
  }
}
```

**New:**
```javascript
{
  inlineStyleHandling: 'class',
  showNodeClass: false
}
```

The `context` wrapper has been removed for cleaner API.

### Return Value

No changes - both return the same Bricks JSON structure.

---

## Troubleshooting

### Issue: "Cannot find module './services/converter'"

**Solution:** Ensure the new services are in your `src/` directory.

### Issue: Different output between old and new

**Solution:** Check if custom processors override default behavior. The new architecture uses a processor registry which may handle elements differently.

### Issue: TypeScript errors

**Solution:** Add type definitions in `src/types/` or use JSDoc comments.

---

## Next Steps

1. Review the implementation plan
2. Create a test branch
3. Migrate one component at a time
4. Run tests after each migration
5. Monitor for issues

---

## Support

For questions or issues during migration, refer to:
- Implementation Plan: `implementation_plan.md`
- Processor Examples: `src/examples/processorUsage.js`
- Service Examples: `src/examples/converterUsage.js`

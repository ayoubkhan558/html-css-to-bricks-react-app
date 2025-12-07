/**
 * Example Usage of New Converter Service
 * This demonstrates how to use the new architecture
 */

import { converterService } from '../services/converter';
import { aiService } from '../services/ai';
import { AI_PROVIDERS } from '../config/constants';

// ============================================
// Example 1: Basic HTML/CSS Conversion
// ============================================

export function convertCodeExample() {
    const html = `
    <div class="container">
      <h1>Hello World</h1>
      <p>This is a paragraph.</p>
    </div>
  `;

    const css = `
    .container {
      padding: 20px;
      background: #f5f5f5;
    }
    h1 {
      color: #333;
      font-size: 2rem;
    }
  `;

    const result = converterService.convert(html, css);
    console.log('Converted:', result);
    return result;
}

// ============================================
// Example 2: AI-Generated Code Conversion
// ============================================

export async function generateAndConvertExample() {
    // Configure AI service
    aiService.configure(AI_PROVIDERS.GEMINI, 'your-api-key-here');

    // Generate code
    const prompt = 'Create a simple hero section with a title and call-to-action button';
    const { html, css, js } = await aiService.generate(prompt);

    // Convert to Bricks
    const result = converterService.convert(html, css, js);
    return result;
}

// ============================================
// Example 3: Custom Options
// ============================================

export function convertWithOptionsExample() {
    const html = '<div style="color: red;">Styled div</div>';

    const result = converterService.convert(html, '', '', {
        inlineStyleHandling: 'class',  // Convert inline styles to classes
        showNodeClass: true,            // Use class names as labels
        includeJs: false                // Don't include JS
    });

    return result;
}

// ============================================
// Example 4: Updating Options
// ============================================

export function updateOptionsExample() {
    // Update global options
    converterService.setOptions({
        inlineStyleHandling: 'inline',
        minifyOutput: true
    });

    // All subsequent conversions will use these options
    const result = converterService.convert('<div>Test</div>');
    return result;
}

// ============================================
// Example 5: Reset State
// ============================================

export function resetExample() {
    // Reset converter state between conversions
    converterService.reset();

    // Now ready for fresh conversion
    const result = converterService.convert('<div>New conversion</div>');
    return result;
}

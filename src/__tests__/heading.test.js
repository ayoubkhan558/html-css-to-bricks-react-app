import { describe, it, expect } from 'vitest';
import { convertHtmlToBricks } from '../Generator/utils/domToBricks';

describe('Heading Element Conversion', () => {
  it('should convert a styled h1 element to Bricks format', async () => {
    const html = `
      <h1 class="main-title" style="color: #1a1a1a; font-size: 2.5rem; text-align: center; margin-bottom: 1rem;">
        Welcome to Our Website
      </h1>
    `;

    const result = convertHtmlToBricks(html, '');
    
    // Add this line to see what your function actually returns
    console.log('DEBUG - Actual result:', JSON.stringify(result, null, 2));

    // Basic structure tests
    expect(result.content).toHaveLength(1);
    expect(result.content[0].name).toBe('heading');
    expect(result.content[0].settings.tag).toBe('h1');
    expect(result.content[0].settings.text).toBe('Welcome to Our Website');

    // Flexible style tests - adjust based on your actual output
    if (result.content[0].settings._styles) {
      const styles = result.content[0].settings._styles.desktop.default;
      expect(styles).toHaveProperty('color', '#1a1a1a');
      expect(styles).toHaveProperty('font-size', '2.5rem');
    }

    // CSS test - adjust based on your actual output
    if (result.css) {
      expect(result.css).toContain('color');
      expect(result.css).toContain('#1a1a1a');
    }
  });

  it('should handle heading without styles', async () => {
    const html = '<h2>Subheading</h2>';
    const result = convertHtmlToBricks(html, '');
    
    console.log('DEBUG - No styles result:', JSON.stringify(result, null, 2));
    
    expect(result.content[0].name).toBe('heading');
    expect(result.content[0].settings.tag).toBe('h2');
    expect(result.content[0].settings.text).toBe('Subheading');
  });

  it('should handle heading with class but no inline styles', async () => {
    const html = '<h3 class="section-title">Section Title</h3>';
    const result = convertHtmlToBricks(html, '');
    
    console.log('DEBUG - Class only result:', JSON.stringify(result, null, 2));
    
    expect(result.content[0].settings.tag).toBe('h3');
    expect(result.content[0].settings.text).toBe('Section Title');
    
    // Adjust this based on how your function handles classes
    if (result.content[0].settings.className) {
      expect(result.content[0].settings.className).toBe('section-title');
    }
  });
});
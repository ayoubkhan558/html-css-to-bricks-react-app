# Brickify - HTML CSS JS to Bricks

This tool is designed to help Bricks Builder users quickly convert their existing HTML/CSS/JS into the proper JSON structure that Bricks Builder can import, saving significant development time when migrating or creating new templates.


## Core Features

### HTML to Bricks Conversion
- Converts raw HTML into Bricks Builder's JSON structure
- Preserves HTML structure and hierarchy
- Handles various HTML elements including section, div, container, forms, buttons, images, and more
- Processes inline styles with flexible handling options

### CSS Processing
- Converts CSS styles into Bricks-compatible format
- Handles class-based styling with proper specificity
- Supports pseudo-classes (:hover, :active, :focus, :visited)
- Preserves class names even without styles
- Advanced typography property handling (font-weight, font-size, color, etc.)

### JavaScript Integration
- Processes and includes JavaScript functionality
- Supports custom JavaScript code integration
- Maintains global elements and their references

### Style Handling Options
- **Skip**: Ignores inline styles completely
- **Inline**: Preserves styles as inline attributes
- **Class**: Converts inline styles to CSS classes with proper merging
  - Maintains existing class styles
  - Merges inline styles with class definitions
  - Preserves typography and layout properties

### Preview Functionality
- Live preview of the generated structure
- Toggle between HTML preview and JSON output
- Real-time updates as you type


### Output Options
- Toggle minified/pretty-printed JSON
- Copy to clipboard functionality
- Option to include/exclude JavaScript


### Advanced Features
- Handles form elements with proper field types
- Processes custom attributes and data-* attributes
- Maintains parent-child relationships in the element tree
- Supports dynamic class name generation
- Properly merges inline styles with existing class definitions
- Handles complex CSS properties and values
- Preserves media queries and responsive styles
- Support for CSS Custom Properties (Variables)
- Support for CSS Grid and Flexbox properties
- Typography property handling support
- Support for more HTML elements (tables, lists, etc.)

---

## Roadmap
- [x] Add support for inline styles to classes
- [x] Add support for bricks inner selector
- [x] Add support for CSS animations and transitions
- [x] Add support for more complex CSS selectors


## Known Bugs
- [ ] SVG Code is not signed by default


## Technical Implementation


### Browser Compatibility
- Works in modern browsers
- Uses DOMParser for HTML parsing
- Fallback to jsdom in Node.js environments


## Created By

This project was created by [Ayoub Khan](https://mayoub.dev).

[![Portfolio](https://img.shields.io/badge/Portfolio-mayoub.dev-4CAF50?style=flat-square)](https://mayoub.dev) [![LinkedIn](https://img.shields.io/badge/LinkedIn-ayoubkhan558-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/ayoubkhan558)
-------------------------------------------------------------
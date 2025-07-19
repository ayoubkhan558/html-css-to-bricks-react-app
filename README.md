# Code2Bricks - HTML CSS JS to Bricks

This tool is designed to help Bricks Builder users quickly convert their existing HTML/CSS/JS into the proper JSON structure that Bricks Builder can import, saving significant development time when migrating or creating new templates.

## Core Features

### HTML to Bricks Conversion
- Converts raw HTML into Bricks Builder's JSON structure
- Preserves HTML structure and hierarchy
- Handles various HTML elements including section, div, container,forms, buttons, images, and more

### CSS Processing
- Converts CSS styles into Bricks-compatible format
- Handles class-based styling
- Supports pseudo-classes (:hover, :active, :focus, :visited)
- Preserves class names even without styles

### JavaScript Integration
- Processes and includes JavaScript functionality
- Supports custom JavaScript code integration
- Maintains global elements and their references

### Style Handling Options
- **Skip**: Ignores inline styles
- **Inline**: Converts styles to inline styles
- **Class**: Converts inline styles to CSS classes

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
- Processes custom attributes
- Maintains parent-child relationships
- Supports dynamic class name generation

---

## Roadmap
- [ ] Add support for more HTML elements
- [ ] Add support for more CSS properties
- [ ] Add support for more JS features  
- [ ] Add support for CSS Variables
- [ ] Add support for CSS Media Queries
- [ ] Add support for inline styles to classes and inline embed

## Known Bugs
- [ ] SVG Code is not signed by default



## Technical Implementation

### Modular Architecture
- Separates concerns into different utility files
- Core conversion logic in [domToBricks.js]
- CSS parsing in [cssParser.js]
- JavaScript processing in [jsProcessor.js]

### Browser Compatibility
- Works in modern browsers
- Uses DOMParser for HTML parsing
- Fallback to jsdom in Node.js environments


## Created By

This project was created by [Ayoub Khan](https://mayoub.dev).

[![Portfolio](https://img.shields.io/badge/Portfolio-mayoub.dev-4CAF50?style=flat-square)](https://mayoub.dev) [![LinkedIn](https://img.shields.io/badge/LinkedIn-ayoubkhan558-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/ayoubkhan558)
-------------------------------------------------------------
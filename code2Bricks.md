# Brickify - Code to Bricks Converter

## Introduction

Welcome to **Brickify** – a powerful web-based tool that transforms HTML, CSS, and JavaScript into Bricks Builder–compatible JSON structure. This tool was created to bridge the gap between traditional web development and Bricks Builder, making it easy to:

- Convert existing HTML templates to Bricks
- Use AI-generated code directly in Bricks Builder
- Migrate legacy websites to Bricks
- Speed up your Bricks development workflow

---

## How It Works

### The Conversion Pipeline

1. **HTML Parsing** – Your HTML is parsed into a DOM tree while preserving the element hierarchy
2. **CSS Processing** – CSS rules are analyzed and mapped to Bricks-compatible properties
3. **Element Mapping** – Each HTML element is converted to the appropriate Bricks component:
   - `<div>` → Div element
   - `<section>` → Section element
   - `<h1>`-`<h6>` → Heading element
   - `<p>` → Text-basic element
   - `<img>` → Image element
   - `<form>` → Form element with fields
   - And many more...
4. **Style Application** – Styles are applied either inline, as global classes, or skipped based on your preference
5. **JSON Generation** – The final Bricks-compatible JSON is generated ready for pasting

---

## Key Features

### 🎨 Style Handling Modes

Choose how you want styles to be processed:

| Mode | Best For | Description |
|------|----------|-------------|
| **Skip** | Clean structure only | Ignores all inline styles |
| **Inline** | Quick testing | Preserves styles as attributes |
| **Class** | Production use | Converts to Bricks global classes |

### 📝 Supported Elements

| Category | Elements |
|----------|----------|
| **Structure** | section, div, container, header, footer, aside, article, main |
| **Text** | h1-h6, p, span, blockquote, address, time, mark |
| **Lists** | ul, ol, li |
| **Media** | img, video, audio, svg |
| **Forms** | form, input, select, textarea, button, label |
| **Tables** | table, thead, tbody, tfoot, tr, th, td |
| **Navigation** | nav, a (with dropdown support) |
| **Misc** | canvas, details, summary, dialog, meter, progress |

### 🎯 CSS Properties Supported

- **Typography**: font-size, font-weight, font-family, line-height, letter-spacing, text-align, text-transform, text-decoration, color
- **Layout**: display, flex, grid, position, width, height, margin, padding
- **Background**: background-color, background-image, background-gradient
- **Borders**: border, border-radius, box-shadow
- **Transforms**: transform, transform-origin, perspective
- **Effects**: filter, backdrop-filter, opacity
- **Transitions**: transition, transition-duration, transition-timing-function
- **Pseudo-classes**: :hover, :focus, :active, :visited

---

## Using the Tool

### Step 1: Input Your Code

Paste your HTML in the HTML tab. If you have CSS or JavaScript, add them in their respective tabs.

### Step 2: Configure Options

- **Style Handling**: Choose Skip, Inline, or Class mode
- **Show Class Names**: Toggle to show original class names as labels
- **Include JavaScript**: Toggle to include JS in output

### Step 3: Preview

Use the live preview to see how your code will look. The structure view shows the element hierarchy.

### Step 4: Copy & Paste

Click "Copy to Clipboard" and paste directly into Bricks Builder using:
- **Mac**: Cmd + Shift + V
- **Windows**: Ctrl + Shift + V

---

## AI Code Generation

Generate code using AI with three provider options:

### Google Gemini (Recommended)
- Free tier available
- Fast response times
- Get API key: [Google AI Studio](https://aistudio.google.com/app/apikey)

### OpenRouter
- Access to multiple free models
- No rate limits on free tier
- Get API key: [OpenRouter](https://openrouter.ai/keys)

### OpenAI
- GPT-4o-mini and other models
- Pay-as-you-go pricing
- Get API key: [OpenAI Platform](https://platform.openai.com/api-keys)

---

## Tips for Best Results

### HTML Structure
- Use semantic HTML elements (`<section>`, `<header>`, `<nav>`)
- Add meaningful classes for better label organization
- Keep nesting reasonable (avoid deeply nested structures)

### CSS Best Practices
- Use class-based styling instead of inline styles when possible
- Avoid `!important` declarations
- Use standard CSS properties (avoid vendor prefixes)

### Forms
- Always include `<label>` elements for form fields
- Use proper input `type` attributes
- Include `name` and `placeholder` attributes

### Images & Media
- Include `alt` text for images
- Specify `width` and `height` attributes when possible
- Use standard file formats (jpg, png, svg)

---

## Companion Tool: Bricks2Code

**Bricks2Code** is the reverse tool – it converts Bricks structure back to clean HTML and CSS. Perfect for:
- Exporting Bricks designs
- Creating backups
- Migrating away from Bricks

---

## Questions & Support

Have questions or suggestions? Feel free to:
- Open an issue on GitHub
- Connect on [LinkedIn](https://www.linkedin.com/in/ayoubkhan558)
- Visit [mayoub.dev](https://mayoub.dev)

---

## Credits

Created with ❤️ by [Ayoub Khan](https://mayoub.dev) for the Bricks Builder community.
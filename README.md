# Brickify - HTML/CSS/JS to Bricks Builder Converter

A powerful web-based tool that converts HTML, CSS, and JavaScript code into Bricks Builder–compatible JSON structure. Designed for Bricks Builder users who want to quickly migrate existing templates or convert AI-generated code into ready-to-use Bricks elements.

## 🚀 Features

### Core Conversion
- **HTML to Bricks** – Converts raw HTML into Bricks Builder's JSON structure with proper element hierarchy
- **CSS Processing** – Transforms CSS styles into Bricks-compatible format with support for:
  - Typography (font-size, font-weight, color, line-height, etc.)
  - Layout (flexbox, grid, positioning, spacing)
  - Backgrounds (colors, gradients, images)
  - Borders and box-shadows
  - Transforms and transitions
  - Filters and effects
  - Pseudo-classes (:hover, :focus, :active)
- **JavaScript Integration** – Optionally include custom JS as a code element

### Element Support
- **Structure**: Sections, Containers, Divs
- **Text**: Headings (H1-H6), Paragraphs, Spans, Blockquotes
- **Media**: Images, Videos, Audio, SVG
- **Forms**: Complete form handling with labels, inputs, selects, textareas
- **Navigation**: Nested nav with dropdown support
- **Tables**: Full table structure preservation
- **Lists**: Ordered and unordered lists
- **Links & Buttons**: With proper link settings

### Style Handling Options
| Mode | Description |
|------|-------------|
| **Skip** | Ignores inline styles completely |
| **Inline** | Preserves styles as inline attributes |
| **Class** | Converts styles to Bricks global classes (recommended) |

### AI Code Generation
Generate HTML/CSS code using AI providers:
- **Google Gemini** – Fast and free tier available
- **OpenAI** – GPT-4o-mini and other models
- **OpenRouter** – Access to multiple free models

### Output Options
- Toggle minified/pretty-printed JSON
- Copy to clipboard with one click
- Include/exclude JavaScript
- Live preview with real-time updates
- Element structure tree view

---

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/ayoubkhan558/brickify.git

# Navigate to project
cd brickify

# Install dependencies
yarn install

# Start development server
yarn dev
```

---

## 📋 Usage

1. **Paste your HTML** into the HTML editor tab
2. **Add CSS** (optional) in the CSS tab
3. **Add JavaScript** (optional) in the JS tab
4. Configure output options as needed
5. Click **Copy to Clipboard**
6. In Bricks Builder, use **Cmd/Ctrl + Shift + V** to paste

---

## 🔧 Development

### Commands
| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn preview` | Preview production build |
| `yarn lint` | Run ESLint |
| `yarn test` | Run tests |
| `yarn test:watch` | Run tests in watch mode |

### Tech Stack
- **React 19** – UI framework
- **Vite 6** – Build tool
- **Sass** – Styling
- **CodeMirror** – Code editor
- **Vitest** – Testing

---

## ✅ Roadmap

### Completed
- [x] Inline styles to classes conversion
- [x] Bricks inner selector support
- [x] CSS animations and transitions
- [x] Complex CSS selectors
- [x] Pseudo-classes (:hover, :focus, etc.)
- [x] SVG element support with classes
- [x] AI code generation integration
- [x] Multiple AI provider support

### Planned
- [ ] Media query handling
- [ ] Pseudo-elements (::before, ::after)

---

## 🐛 Known Issues

- Nested forms may not convert correctly
- Some complex CSS selectors are added as custom CSS
- Media queries are preserved but not converted to Bricks breakpoints

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 👤 Author

Created by [Ayoub Khan](https://mayoub.dev)

[![Portfolio](https://img.shields.io/badge/Portfolio-mayoub.dev-4CAF50?style=flat-square)](https://mayoub.dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ayoubkhan558-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/ayoubkhan558)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
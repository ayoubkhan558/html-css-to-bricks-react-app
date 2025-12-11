
#### Source Directory (`src/`)

- **App Components**: Core React components such as `App.jsx` and `App.scss`.
- **Generator Module**: Handles the conversion logic (HTML → Bricks JSON) in files like `bricksGenerator.js` and `domToBricks.js`.
- **Element Processors**: Specialized processors for elements like buttons, forms, and images (e.g., `buttonProcessor.js`, `formProcessor.js`).
- **CSS Mappers**: Files like `background.js` and `layout-spacing.js` convert CSS rules to Bricks format.
- **Preview & Structure View**: Real-time UI components for preview and structure tree.

### Core Utilities
- **CSS Parser**: Converts CSS into a manageable map for Bricks conversion.
- **DOM Traversal**: Walks the DOM to map elements to Bricks-compatible nodes.
- **JS Processing**: Optionally integrates JS into the Bricks JSON output.

---

## AI Integration

Generate code with the help of AI through multiple provider options:

- **Google Gemini**: Fast and free with an API key.
- **OpenRouter**: Free models with no rate limits.
- **OpenAI**: GPT-4o-mini and other models available.

---

## Technology Stack

- **Frontend**: React 19, Vite 6
- **Styling**: Sass, CSS Modules
- **Code Editor**: `@uiw/react-codemirror` for HTML/CSS editing
- **Testing**: Vitest
- **AI Integration**: OpenAI, Google Gemini, OpenRouter APIs

---

## Development & Build Commands

- **Start dev server**: `yarn dev`
- **Build for production**: `yarn build`
- **Preview production**: `yarn preview`
- **Run linter**: `yarn lint`
- **Run tests**: `yarn test`
- **Run tests in watch mode**: `yarn test:watch`

---

## Code Quality Findings

### Areas for Improvement
- **Performance**: Memoize `getCssPropMappers()` and optimize CSS selector matching.
- **Code Cleanup**: Remove unused imports, debug logs, and redundant functions like `convertStylesToClass()`.
- **Architectural Suggestions**:
  - Centralize property mappers.
  - Consider adding TypeScript for better maintainability.
  - Increase unit test coverage.

### Recently Fixed Issues
- **SVG Class Mapping**: Fixed issue where SVG elements didn’t receive correct CSS classes.

---

## Suggested Directory Additions
```cmd
For scalability, consider adding:
src/hooks/ # Custom hooks for state management
src/constants/ # Constants and enums (e.g., CSS modes)
src/types/ # JSDoc or TypeScript definitions
src/fixtures/ # Sample HTML/CSS/JS for testing
tests/ # Unit and integration tests
e2e/ # End-to-end tests
```

---

## Credits

Created with ❤️ by [Ayoub Khan](https://mayoub.dev) for the Bricks Builder community.
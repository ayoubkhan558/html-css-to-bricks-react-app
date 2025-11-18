# Brickify Project Analysis

## Project Requirements Analysis

### Objective
Convert raw HTML/CSS/JS into Bricks Builder–compatible JSON for rapid template creation, with live preview and configurable output options.

### Inputs
- HTML string
- CSS string (optional)
- JS string (optional)
- Generator options: CSS handling mode (skip/inline/convert-to-classes), include/exclude JS, minify/pretty print JSON, preview toggles.

### Outputs
- Bricks JSON (minified or pretty)
- Optional inclusion of processed JS
- Element structure tree view
- Live rendered HTML preview

### Core Functional Requirements
- Parse HTML DOM reliably and preserve hierarchy.
- Map HTML elements to Bricks components via per-element processors (buttons, headings, lists, images, links, forms, tables, video/audio, SVG, nav).
- Convert CSS rules to Bricks style format:
  - Support typography, background, layout (sizing/spacing/positioning), display, grid/flex, borders/shadows, transitions/filters, transforms, scroll, misc layout.
  - Respect pseudo-classes like :hover, :focus.
  - Optional conversion to classes vs inline vs skip.
- Handle advanced cases:
  - Forms (labels, inputs, validation attributes)
  - Data attributes and media queries
  - Dynamic classes
- Include custom JS (optional) in output.
- Provide live preview and structure tree.
- Output options: copy to clipboard, exclude JS, minified/pretty JSON.

### Non-Functional Requirements
- Client-side only; modern browsers (DOMParser).
- Quick, responsive UI (React 19, Vite 6).
- Maintainable modular utilities and processors.
- ESLint configured (flat config), unit tests via Vitest.
- No special env vars; Yarn scripts for dev/build/test.

### Constraints and Assumptions
- No backend / DB / auth.
- Parsing is based on standard DOM; Shadow DOM/external resources may require special handling or are out of scope.
- Bricks Builder JSON must conform to expected schema (enforced via mappers/processors).
- Large CSS files/media queries may need careful performance handling.

### Edge Cases to Consider
- Invalid or malformed HTML.
- Deeply nested elements with conflicting CSS specificity.
- Multiple forms or nested forms.
- External assets (images/fonts) not available at preview time.
- Complex SVGs and inline styles.
- Unsupported/unknown HTML tags.
- Pseudo-elements (::before/::after) and complex media queries mapping.

### Success Metrics
- Correctness of Bricks JSON output that renders as intended in Bricks Builder.
- Fidelity of styles after conversion.
- Stable performance for typical page-sized inputs.
- Usability: clear structure view, preview parity, straightforward options.

---

## Project Folder Structure Guide

### Root Files
```
/
├── package.json           # Scripts and dependencies (React/Vite/Vitest/ESLint)
├── vite.config.js         # Vite configuration
├── eslint.config.js       # Flat ESLint config
├── yarn.lock              # Yarn dependency lock
├── index.html             # App HTML shell
├── README.md              # Project overview
└── Brickify.md         # Additional documentation
```

### Source Directory (`src/`)

#### Entry Points
```
src/
├── App.jsx                # Root app component
├── App.scss               # Global styles
└── main.jsx               # React/Vite entry
```

#### Theme
```
src/theme/
└── codemirror-theme.js    # Code editor theme setup
```

#### Contexts
```
src/contexts/
├── AppContext.jsx         # App-wide settings/state
└── GeneratorContext.jsx   # Generator-specific state and options
```

#### Shared Components
```
src/components/
├── CodeEditor.jsx         # Shared editor wrapper
├── Tooltip.jsx            # UI helper component
└── Tooltip.scss           # Tooltip styles
```

#### Generator Module
```
src/Generator/
├── index.jsx              # Generator page/entry
├── Generator.scss         # Styles for generator screen
└── CssMatcher.jsx         # CSS matching helper UI
```

##### Generator Components
```
src/Generator/components/
├── GeneratorComponent.jsx     # Main generator UI container
├── GeneratorComponent.scss    # Generator container styles
├── CodeEditor.jsx             # Editor for HTML/CSS/JS input
├── Preview.jsx                # Live preview panel
├── Preview.scss               # Preview panel styles
├── StructureView.jsx          # Tree view for element hierarchy
├── StructureView.scss         # Structure view styles
├── AboutModal.jsx             # About/help modal
└── AboutModal.scss            # About modal styles
```

##### Generator Utils
```
src/Generator/utils/
├── bricksGenerator.js     # High-level assembly to produce Bricks JSON
├── domToBricks.js         # Core HTML → Bricks conversion pipeline
├── cssParser.js           # CSS parsing to internal representation
├── jsProcessor.js         # JS inclusion/processing logic
└── utils.js               # Shared utility functions
```

##### Processors
```
src/Generator/utils/processors/
└── attributeProcessor.js  # General attribute handling (data-* etc.)
```

##### Element Processors
```
src/Generator/utils/elementProcessors/
├── alertProcessor.js              # Alert/notification elements
├── audioProcessor.js              # Audio elements
├── buttonProcessor.js             # Button elements
├── formProcessor.js               # Form elements
├── headingProcessor.js            # Heading elements (h1-h6)
├── imageProcessor.js              # Image elements
├── labelUtils.js                  # Label utilities
├── linkProcessor.js               # Link/anchor elements
├── listProcessor.js               # List elements (ul, ol, li)
├── miscProcessor.js               # Miscellaneous elements
├── navProcessor.js                # Navigation elements
├── structureLayoutProcessor.js    # Structural/layout elements (div, section, etc.)
├── svgProcessor.js                # SVG elements
├── tableProcessor.js              # Table elements
├── textElementProcessor.js        # Text elements (p, span, etc.)
└── videoProcessor.js              # Video elements
```

##### Property Mappers (CSS → Bricks Style)
```
src/Generator/utils/propertyMappers/
├── index.js                   # Main mapper export
├── mapperUtils.js             # Shared mapper utilities
├── background.js              # Background properties
├── boder-box-shadow.js        # Border and box-shadow properties
├── content-flexbox.js         # Flexbox properties
├── content-grid.js            # Grid properties
├── display.js                 # Display properties
├── filters-transitions.js     # Filters and transitions
├── layout-misc.js             # Miscellaneous layout
├── layout-position.js         # Position properties
├── layout-scroll-snap.js      # Scroll snap properties
├── layout-sizing.js           # Sizing properties (width, height)
├── layout-spacing.js          # Spacing properties (margin, padding)
├── scroll.js                  # Scroll properties
├── transforms.js              # Transform properties
└── typography.js              # Typography properties
```

#### Tests
```
src/__tests__/
└── heading.test.js        # Vitest unit tests example
```

---

## Suggested Directory Additions

For future scalability (no files created unless requested):

```
src/hooks/                 # Custom hooks (e.g., useGeneratorOptions, useClipboard)
src/constants/             # Constants/enums (CSS modes, default options)
src/types/                 # JSDoc or TS type definitions/interfaces
src/fixtures/              # Sample HTML/CSS/JS inputs for testing/demo
src/lib/                   # Shared pure functions (parsers/mappers)
tests/                     # Broader unit/integration tests
e2e/                       # End-to-end tests (Playwright/Cypress)
```

---

## Quick Workflow Overview

1. **User inputs HTML/CSS/JS** in `GeneratorComponent`
2. **CSS parsing**: `cssParser.js` parses CSS
3. **Style mapping**: `propertyMappers/*` map styles into Bricks format
4. **DOM traversal**: `domToBricks.js` walks the DOM
5. **Element processing**: `elementProcessors/*` build Bricks JSON nodes
6. **JS handling**: `jsProcessor.js` optionally injects or attaches JS
7. **Assembly**: `bricksGenerator.js` coordinates pipeline and produces final JSON
8. **Display**: `StructureView` shows tree; `Preview` renders HTML; options control output formatting

---

## Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Sass, CSS Modules
- **Code Editing**: `@uiw/react-codemirror` with HTML/CSS language support
- **Syntax Highlighting**: PrismJS
- **Linting**: ESLint with React plugins
- **Testing**: Vitest
- **Dependency Management**: Yarn

---

## Development Commands

- **Start dev server**: `yarn dev`
- **Build for production**: `yarn build`
- **Preview production build**: `yarn preview`
- **Run linter**: `yarn lint`
- **Run tests**: `yarn test`
- **Run tests in watch mode**: `yarn test:watch`

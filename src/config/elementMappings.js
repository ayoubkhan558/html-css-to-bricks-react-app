/**
 * Element Mappings
 * Maps HTML tags to Bricks element configurations
 */

// Tag to Bricks element mapping
export const TAG_TO_BRICKS = {
    // Structure elements
    div: { name: 'div', label: 'Div' },
    section: { name: 'section', label: 'Section' },
    header: { name: 'div', label: 'Header' },
    footer: { name: 'div', label: 'Footer' },
    main: { name: 'div', label: 'Main' },
    aside: { name: 'div', label: 'Aside' },
    article: { name: 'div', label: 'Article' },
    nav: { name: 'nav-nested', label: 'Navigation' },

    // Text elements
    p: { name: 'text-basic', label: 'Paragraph' },
    span: { name: 'text-basic', label: 'Span' },
    blockquote: { name: 'text-basic', label: 'Block Quote' },
    address: { name: 'text-basic', label: 'Address' },
    time: { name: 'text-basic', label: 'Time' },
    mark: { name: 'text-basic', label: 'Mark' },

    // Headings
    h1: { name: 'heading', label: 'H1 Heading' },
    h2: { name: 'heading', label: 'H2 Heading' },
    h3: { name: 'heading', label: 'H3 Heading' },
    h4: { name: 'heading', label: 'H4 Heading' },
    h5: { name: 'heading', label: 'H5 Heading' },
    h6: { name: 'heading', label: 'H6 Heading' },

    // Lists
    ul: { name: 'div', label: 'List' },
    ol: { name: 'div', label: 'Ordered List' },
    li: { name: 'div', label: 'List Item' },

    // Table
    table: { name: 'div', label: 'Table' },
    thead: { name: 'div', label: 'Table Header' },
    tbody: { name: 'div', label: 'Table Body' },
    tfoot: { name: 'div', label: 'Table Footer' },
    tr: { name: 'div', label: 'Table Row' },
    th: { name: 'text-basic', label: 'Header Cell' },
    td: { name: 'text-basic', label: 'Table Cell' },

    // Form
    form: { name: 'form', label: 'Form' },
    input: { name: 'form', label: 'Input' },
    select: { name: 'form', label: 'Select' },
    textarea: { name: 'form', label: 'Textarea' },
    button: { name: 'button', label: 'Button' },
    label: { name: 'text-basic', label: 'Label' },

    // Media
    img: { name: 'image', label: 'Image' },
    video: { name: 'video', label: 'Video' },
    audio: { name: 'audio', label: 'Audio' },
    svg: { name: 'svg', label: 'SVG' },

    // Links
    a: { name: 'text-link', label: 'Link' },

    // Misc
    canvas: { name: 'code', label: 'Canvas' },
    details: { name: 'div', label: 'Details' },
    summary: { name: 'div', label: 'Summary' },
    dialog: { name: 'div', label: 'Dialog' },
    meter: { name: 'div', label: 'Meter' },
    progress: { name: 'div', label: 'Progress' },
    script: { name: 'code', label: 'Script' }
};

// Get Bricks element config for a tag
export function getBricksElement(tag) {
    return TAG_TO_BRICKS[tag] || { name: 'div', label: tag.toUpperCase() };
}

// Get label for a tag
export function getTagLabel(tag) {
    return TAG_TO_BRICKS[tag]?.label || tag.toUpperCase();
}

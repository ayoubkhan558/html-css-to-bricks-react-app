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
    figure: { name: 'div', label: 'Figure' },
    figcaption: { name: 'text-basic', label: 'Figure Caption' },
    hgroup: { name: 'div', label: 'Heading Group' },
    search: { name: 'div', label: 'Search' },

    // Text elements
    p: { name: 'text-basic', label: 'Paragraph' },
    span: { name: 'text-basic', label: 'Span' },
    blockquote: { name: 'text-basic', label: 'Block Quote' },
    address: { name: 'text-basic', label: 'Address' },
    time: { name: 'text-basic', label: 'Time' },
    mark: { name: 'text-basic', label: 'Mark' },
    code: { name: 'text-basic', label: 'Code' },
    pre: { name: 'code', label: 'Preformatted' },
    kbd: { name: 'text-basic', label: 'Keyboard Input' },
    samp: { name: 'text-basic', label: 'Sample Output' },
    var: { name: 'text-basic', label: 'Variable' },
    cite: { name: 'text-basic', label: 'Citation' },
    q: { name: 'text-basic', label: 'Inline Quote' },
    abbr: { name: 'text-basic', label: 'Abbreviation' },
    dfn: { name: 'text-basic', label: 'Definition' },
    small: { name: 'text-basic', label: 'Small Text' },
    strong: { name: 'text-basic', label: 'Strong' },
    b: { name: 'text-basic', label: 'Bold' },
    em: { name: 'text-basic', label: 'Emphasis' },
    i: { name: 'text-basic', label: 'Italic' },
    u: { name: 'text-basic', label: 'Underline' },
    s: { name: 'text-basic', label: 'Strikethrough' },
    del: { name: 'text-basic', label: 'Deleted Text' },
    ins: { name: 'text-basic', label: 'Inserted Text' },
    sub: { name: 'text-basic', label: 'Subscript' },
    sup: { name: 'text-basic', label: 'Superscript' },
    data: { name: 'text-basic', label: 'Data' },
    bdi: { name: 'text-basic', label: 'Bidirectional Isolate' },
    bdo: { name: 'text-basic', label: 'Bidirectional Override' },
    wbr: { name: 'text-basic', label: 'Word Break' },
    ruby: { name: 'text-basic', label: 'Ruby' },
    rt: { name: 'text-basic', label: 'Ruby Text' },
    rp: { name: 'text-basic', label: 'Ruby Parenthesis' },

    // Headings
    h1: { name: 'heading', label: 'H1 Heading' },
    h2: { name: 'heading', label: 'H2 Heading' },
    h3: { name: 'heading', label: 'H3 Heading' },
    h4: { name: 'heading', label: 'H4 Heading' },
    h5: { name: 'heading', label: 'H5 Heading' },
    h6: { name: 'heading', label: 'H6 Heading' },

    // Lists
    ul: { name: 'div', label: 'Unordered List' },
    ol: { name: 'div', label: 'Ordered List' },
    li: { name: 'div', label: 'List Item' },
    dl: { name: 'div', label: 'Description List' },
    dt: { name: 'text-basic', label: 'Description Term' },
    dd: { name: 'text-basic', label: 'Description Details' },
    menu: { name: 'div', label: 'Menu' },

    // Table
    table: { name: 'div', label: 'Table' },
    caption: { name: 'text-basic', label: 'Table Caption' },
    colgroup: { name: 'div', label: 'Column Group' },
    col: { name: 'div', label: 'Column' },
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
    fieldset: { name: 'div', label: 'Fieldset' },
    legend: { name: 'text-basic', label: 'Legend' },
    datalist: { name: 'form', label: 'Datalist' },
    option: { name: 'form', label: 'Option' },
    optgroup: { name: 'form', label: 'Option Group' },
    output: { name: 'text-basic', label: 'Output' },

    // Media
    img: { name: 'image', label: 'Image' },
    video: { name: 'video', label: 'Video' },
    audio: { name: 'audio', label: 'Audio' },
    source: { name: 'div', label: 'Media Source' },
    track: { name: 'div', label: 'Text Track' },
    picture: { name: 'image', label: 'Picture' },
    svg: { name: 'svg', label: 'SVG' },
    iframe: { name: 'video', label: 'IFrame' },
    embed: { name: 'video', label: 'Embed' },
    object: { name: 'video', label: 'Object' },
    param: { name: 'div', label: 'Parameter' },
    map: { name: 'div', label: 'Image Map' },
    area: { name: 'div', label: 'Image Map Area' },

    // Links
    a: { name: 'text-link', label: 'Link' },

    // Interactive elements
    details: { name: 'div', label: 'Details' },
    summary: { name: 'div', label: 'Summary' },
    dialog: { name: 'div', label: 'Dialog' },

    // Embedded content
    canvas: { name: 'code', label: 'Canvas' },
    noscript: { name: 'code', label: 'No Script' },
    script: { name: 'code', label: 'Script' },
    template: { name: 'code', label: 'Template' },
    slot: { name: 'div', label: 'Slot' },

    // Progress & meter
    meter: { name: 'div', label: 'Meter' },
    progress: { name: 'div', label: 'Progress' },

    // Sectioning & grouping
    hr: { name: 'divider', label: 'Horizontal Rule' },
    br: { name: 'text-basic', label: 'Line Break' },

    // Special purpose
    portal: { name: 'div', label: 'Portal' }
};

// Get Bricks element config for a tag
export function getBricksElement(tag) {
    return TAG_TO_BRICKS[tag] || { name: 'div', label: tag.toUpperCase() };
}

// Get label for a tag
export function getTagLabel(tag) {
    return TAG_TO_BRICKS[tag]?.label || tag.toUpperCase();
}
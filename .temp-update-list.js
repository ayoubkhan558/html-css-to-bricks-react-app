// Batch update script for remaining elementProcessors
// This file lists all remaining files that need the import update

const filesToUpdate = [
    'svgProcessor.js',
    'structureLayoutProcessor.js',
    'navProcessor.js',
    'miscProcessor.js',
    'listProcessor.js',
    'linkProcessor.js',
    'imageProcessor.js',
    'headingProcessor.js',
    'formProcessor.js',
    'buttonProcessor.js',
    'audioProcessor.js',
    'alertProcessor.js'
];

// All need: import { getElementLabel } from '@lib/bricks';
// Instead of: import { getElementLabel } from '@generator/elementUtils';

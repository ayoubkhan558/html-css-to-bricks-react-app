/**
 * CSS Processor Service
 * Handles CSS parsing, variable resolution, and selector matching
 */

import { buildCssMap, matchCSSSelectors } from '../../Generator/utils/cssParser';

export class CssProcessor {
    constructor() {
        this.cssMap = {};
        this.variables = {};
        this.rootStyles = '';
        this.keyframes = [];
    }

    /**
     * Parses CSS and builds internal maps
     * @param {string} css - CSS string to parse
     * @returns {Object} CSS context { cssMap, variables, rootStyles, keyframes }
     */
    parse(css) {
        if (!css || !css.trim()) {
            return this.getEmptyContext();
        }

        try {
            const result = buildCssMap(css);

            this.cssMap = result.cssMap || {};
            this.variables = result.variables || {};
            this.rootStyles = result.rootStyles || '';
            this.keyframes = result.keyframes || [];

            return this.getContext();
        } catch (error) {
            console.error('CSS parsing error:', error);
            return this.getEmptyContext();
        }
    }

    /**
     * Gets the current CSS context
     * @returns {Object} CSS context
     */
    getContext() {
        return {
            cssMap: this.cssMap,
            variables: this.variables,
            rootStyles: this.rootStyles,
            keyframes: this.keyframes
        };
    }

    /**
     * Gets an empty CSS context
     * @returns {Object} Empty context
     */
    getEmptyContext() {
        return {
            cssMap: {},
            variables: {},
            rootStyles: '',
            keyframes: []
        };
    }

    /**
     * Matches CSS selectors for a DOM node
     * @param {Node} node - DOM node
     * @returns {Object} Match result { properties, pseudoSelectors }
     */
    matchSelectors(node) {
        if (!node || !this.cssMap) {
            return { properties: {}, pseudoSelectors: [] };
        }

        return matchCSSSelectors(node, this.cssMap);
    }

    /**
     * Gets CSS variables
     * @returns {Object} CSS variables
     */
    getVariables() {
        return this.variables;
    }

    /**
     * Gets root styles
     * @returns {string} Root styles
     */
    getRootStyles() {
        return this.rootStyles;
    }

    /**
     * Gets keyframes
     * @returns {Array} Keyframes array
     */
    getKeyframes() {
        return this.keyframes;
    }

    /**
     * Resets the processor state
     */
    reset() {
        this.cssMap = {};
        this.variables = {};
        this.rootStyles = '';
        this.keyframes = [];
    }
}

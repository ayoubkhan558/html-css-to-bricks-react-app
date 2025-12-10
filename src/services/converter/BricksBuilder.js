/**
 * Bricks Builder Service
 * Assembles final Bricks JSON structure
 */

import { BRICKS_VERSION, BRICKS_SOURCE, BRICKS_SOURCE_URL } from '@config/constants';
import { generateId } from '@lib/bricks';

export class BricksBuilder {
    constructor() {
        this.content = [];
        this.globalClasses = [];
    }

    /**
     * Builds the final Bricks structure
     * @param {Array} elements - Processed elements
     * @param {Array} globalClasses - Global CSS classes
     * @param {Object} cssContext - CSS context (rootStyles, keyframes)
     * @returns {Object} Bricks structure
     */
    build(elements, globalClasses, cssContext = {}) {
        this.content = elements;
        this.globalClasses = globalClasses;

        // Add root styles if present
        if (cssContext.rootStyles) {
            this.addRootStyles(cssContext.rootStyles);
        }

        // Add keyframes if present
        if (cssContext.keyframes && cssContext.keyframes.length > 0) {
            this.addKeyframes(cssContext.keyframes);
        }

        return this.getStructure();
    }

    /**
     * Adds JavaScript as a code element
     * @param {string} js - JavaScript code
     * @param {string} parentId - Parent element ID
     */
    addJavaScript(js, parentId = '0') {
        if (!js || !js.trim()) return;

        const jsElement = {
            id: generateId(),
            name: 'code',
            parent: parentId,
            children: [],
            settings: {
                executeCode: true,
                noRoot: true,
                javascriptCode: js.trim()
            }
        };

        this.content.push(jsElement);

        // Add to parent's children if parent exists
        const parent = this.content.find(el => el.id === parentId);
        if (parent && Array.isArray(parent.children)) {
            parent.children.push(jsElement.id);
        }
    }

    /**
     * Adds root styles to the first global class
     * @param {string} rootStyles - Root CSS styles
     */
    addRootStyles(rootStyles) {
        if (!rootStyles || !rootStyles.trim()) return;

        const targetClass = this.getFirstTopLevelClass();

        if (targetClass) {
            if (!targetClass.settings._cssCustom) {
                targetClass.settings._cssCustom = '';
            }
            targetClass.settings._cssCustom = `${rootStyles}\n${targetClass.settings._cssCustom}`.trim();
        } else {
            // Create a new class for root styles if none exists
            this.globalClasses.push({
                id: generateId(),
                name: 'root-styles',
                settings: {
                    _cssCustom: rootStyles
                }
            });
        }
    }

    /**
     * Adds keyframes to the first global class
     * @param {Array} keyframes - Keyframes array
     */
    addKeyframes(keyframes) {
        if (!keyframes || keyframes.length === 0) return;

        const keyframesCSS = keyframes.map(kf => kf.rule).join('\n\n');
        const targetClass = this.getFirstTopLevelClass();

        if (targetClass) {
            if (!targetClass.settings._cssCustom) {
                targetClass.settings._cssCustom = '';
            }
            targetClass.settings._cssCustom = `${targetClass.settings._cssCustom}\n\n${keyframesCSS}`.trim();
        } else {
            // Create a new class for keyframes if none exists
            this.globalClasses.push({
                id: generateId(),
                name: 'animations',
                settings: {
                    _cssCustom: keyframesCSS
                }
            });
        }
    }

    /**
     * Gets the first top-level element's class
     * @returns {Object|null} First class or null
     */
    getFirstTopLevelClass() {
        if (this.content.length > 0 && this.content[0].settings._cssGlobalClasses) {
            const firstClassId = this.content[0].settings._cssGlobalClasses[0];
            return this.globalClasses.find(c => c.id === firstClassId);
        }

        return this.globalClasses[0] || null;
    }

    /**
     * Gets the final Bricks structure
     * @returns {Object} Bricks JSON structure
     */
    getStructure() {
        return {
            content: this.content,
            source: BRICKS_SOURCE,
            sourceUrl: BRICKS_SOURCE_URL,
            version: BRICKS_VERSION,
            globalClasses: this.globalClasses,
            globalElements: []
        };
    }

    /**
     * Resets the builder state
     */
    reset() {
        this.content = [];
        this.globalClasses = [];
    }
}

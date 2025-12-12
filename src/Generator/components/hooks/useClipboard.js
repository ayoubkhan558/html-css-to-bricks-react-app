import { useState, useCallback } from 'react';
import { logger } from '@lib/logger';

/**
 * Custom hook for clipboard operations
 * Handles copying text to clipboard with feedback
 */
export const useClipboard = () => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = useCallback(async (text) => {
        if (!text) return false;

        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
            return true;
        } catch (err) {
            logger.error('Failed to copy text', {
                file: 'useClipboard.js',
                step: 'copyToClipboard',
                feature: 'Clipboard API'
            }, err);
            return false;
        }
    }, []);

    const handleCopyJson = useCallback(async (output) => {
        if (!output) return;
        try {
            await navigator.clipboard.writeText(output);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 3000);
        } catch (err) {
            logger.error('Failed to copy JSON to clipboard', {
                file: 'useClipboard.js',
                step: 'handleCopyJson',
                feature: 'JSON Export'
            }, err);
        }
    }, []);

    const handleExportJson = useCallback((output) => {
        if (!output) return;
        try {
            const blob = new Blob([output], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `bricks-structure-${Date.now()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            logger.error('Failed to export JSON file', {
                file: 'useClipboard.js',
                step: 'handleExportJson',
                feature: 'File Download'
            }, err);
        }
    }, []);

    return {
        isCopied,
        copyToClipboard,
        handleCopyJson,
        handleExportJson,
        setIsCopied
    };
};

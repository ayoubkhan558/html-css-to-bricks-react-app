
// Parse box-shadow CSS property
export function parseBoxShadow(boxShadow) {
    if (!boxShadow || boxShadow === 'none') {
        return null;
    }

    // Handle multiple shadows (comma-separated)
    const shadows = boxShadow.split(',').map(s => s.trim());

    return shadows.map(shadow => {
        // Parse inset, offsets, blur, spread, and color
        const parts = shadow.split(/\s+/);
        const result = {
            inset: false,
            offsetX: '0px',
            offsetY: '0px',
            blur: '0px',
            spread: '0px',
            color: 'rgba(0,0,0,0.5)'
        };

        // Check for inset
        if (parts.includes('inset')) {
            result.inset = true;
            parts.splice(parts.indexOf('inset'), 1);
        }

        // Parse color (last value if it's a color, otherwise default)
        const lastPart = parts[parts.length - 1];
        if (lastPart && (lastPart.startsWith('#') || lastPart.startsWith('rgb') || lastPart.startsWith('hsl'))) {
            result.color = lastPart;
            parts.pop();
        }

        // Parse numeric values
        const numbers = parts.map(part => {
            const num = parseValue(part);
            return isNaN(num) ? '0px' : `${num}px`;
        });

        // Assign values based on count
        if (numbers.length >= 1) result.offsetX = numbers[0];
        if (numbers.length >= 2) result.offsetY = numbers[1];
        if (numbers.length >= 3) result.blur = numbers[2];
        if (numbers.length >= 4) result.spread = numbers[3];

        return result;
    });
}

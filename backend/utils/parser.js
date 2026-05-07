import Tesseract from 'tesseract.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

/**
 * Extracts text from an image or PDF buffer
 */
export async function extractTextFromFile(buffer, mimetype) {
    if (mimetype.includes('pdf')) {
        const data = await pdf(buffer);
        return data.text;
    } else if (mimetype.includes('image')) {
        const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
        return text;
    }
    return '';
}

/**
 * Parses extracted text to identify lab markers and values
 */
export function parseLabText(text) {
    const results = {};
    const lines = text.split('\n');

    const markers = [
        { name: 'hemoglobin', patterns: [/hemoglobin/i, /hgb/i] },
        { name: 'glucose', patterns: [/glucose/i, /glu/i, /sugar/i] },
        { name: 'cholesterol', patterns: [/cholesterol/i, /chol/i] }
    ];

    lines.forEach(line => {
        markers.forEach(marker => {
            marker.patterns.forEach(pattern => {
                if (pattern.test(line)) {
                    const match = line.match(/(\d+(\.\d+)?)/);
                    if (match) {
                        results[marker.name] = parseFloat(match[0]);
                    }
                }
            });
        });
    });

    return results;
}

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
        { name: 'hemoglobin', patterns: [/hemoglobin/i, /\bhgb\b/i], unit: 'g/dL' },
        { name: 'hematocrit', patterns: [/hematocrit/i, /\bhct\b/i], unit: '%' },
        { name: 'wbc', patterns: [/white blood cell/i, /\bwbc\b/i], unit: '10^3/uL' },
        { name: 'platelets', patterns: [/platelet/i, /\bplt\b/i], unit: '10^3/uL' },
        { name: 'glucose', patterns: [/glucose/i, /\bglu\b/i, /blood sugar/i], unit: 'mg/dL' },
        { name: 'a1c', patterns: [/hba1c/i, /a1c/i], unit: '%' },
        { name: 'cholesterol', patterns: [/total cholesterol/i, /\bcholesterol\b/i, /\bchol\b/i], unit: 'mg/dL' },
        { name: 'ldl', patterns: [/\bldl\b/i], unit: 'mg/dL' },
        { name: 'hdl', patterns: [/\bhdl\b/i], unit: 'mg/dL' },
        { name: 'triglycerides', patterns: [/triglyceride/i, /\btg\b/i], unit: 'mg/dL' },
        { name: 'creatinine', patterns: [/creatinine/i, /\bcr\b/i], unit: 'mg/dL' },
        { name: 'egfr', patterns: [/\begfr\b/i, /estimated gfr/i], unit: 'mL/min/1.73m2' },
        { name: 'tsh', patterns: [/\btsh\b/i, /thyroid stimulating/i], unit: 'mIU/L' },
        { name: 'alt', patterns: [/\balt\b/i], unit: 'U/L' },
        { name: 'ast', patterns: [/\bast\b/i], unit: 'U/L' },
        { name: 'psa', patterns: [/\bpsa\b/i, /prostate specific/i], unit: 'ng/mL' },
        { name: 'testosterone', patterns: [/testosterone/i], unit: 'ng/dL' },
        { name: 'ferritin', patterns: [/ferritin/i], unit: 'ng/mL' },
        { name: 'vitaminD', patterns: [/vitamin d/i, /25.?oh/i], unit: 'ng/mL' }
    ];

    lines.forEach(line => {
        markers.forEach(marker => {
            marker.patterns.forEach(pattern => {
                if (pattern.test(line)) {
                    const match = line.match(/(-?\d+(\.\d+)?)/);
                    if (match) {
                        results[marker.name] = {
                            value: parseFloat(match[0]),
                            unit: marker.unit,
                            sourceLine: line.trim()
                        };
                    }
                }
            });
        });
    });

    return results;
}

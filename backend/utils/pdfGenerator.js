import PDFDocument from 'pdfkit';

/**
 * Generates a PDF report for the patient and doctor
 * @param {object} data - Analysis data
 * @param {Stream} res - Express response stream
 */
export function generateHealthReport(data, res) {
    const doc = new PDFDocument({ margin: 50 });

    // Stream the PDF directly to the response
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('HealthGuard AI - Health Analysis Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
    doc.moveDown();

    // Patient Info
    doc.fontSize(14).text('Patient Summary', { underline: true });
    doc.fontSize(12).text(`Age: ${data.structured.age}`);
    doc.fontSize(12).text(`Gender: ${data.structured.gender}`);
    doc.fontSize(12).text(`Symptoms: ${data.structured.symptoms.join(', ')}`);
    doc.moveDown();

    // Analysis
    doc.fontSize(14).text('AI Insight', { underline: true });
    doc.fontSize(12).text(data.insight);
    doc.moveDown();

    // Lab Analysis
    doc.fontSize(14).text('Lab Visual Insights', { underline: true });
    Object.entries(data.colorCodedLabs).forEach(([test, color]) => {
        doc.fontSize(12).text(`${test}: ${color}`);
    });
    doc.moveDown();

    // Clinician Section
    doc.moveDown(2);
    const clinicianBoxTop = doc.y;
    doc.rect(40, clinicianBoxTop, 520, 220).fillAndStroke('#f8fafc', '#e2e8f0');
    doc.fillColor('#0f172a').fontSize(14).text('CLINICAL BRIDGE - SBAR REASONING', 50, clinicianBoxTop + 15, { align: 'center', bold: true });
    doc.moveDown(0.5);
    
    const sbarContent = [
        { label: 'SITUATION', text: data.clinicianSummary.SBAR_Situation },
        { label: 'BACKGROUND', text: data.clinicianSummary.SBAR_Background },
        { label: 'ASSESSMENT', text: data.clinicianSummary.SBAR_Assessment },
        { label: 'RECOMMENDATION', text: data.clinicianSummary.SBAR_Recommendation }
    ];

    let currentY = clinicianBoxTop + 45;
    sbarContent.forEach(item => {
        doc.fillColor('#1e293b').fontSize(10).text(`${item.label}:`, 60, currentY, { bold: true });
        doc.fillColor('#334155').fontSize(10).text(item.text, 160, currentY, { width: 380 });
        currentY += doc.heightOfString(item.text, { width: 380 }) + 10;
    });

    doc.moveDown(2);

    // Footer with Triage guidance
    doc.fillColor('#64748b').fontSize(9).text('Reasoning based on WHO guidelines, CDC health advisory protocols, and integrated environmental context.', { align: 'center' });
    doc.moveDown();

    // Safety Disclaimer
    doc.rect(50, doc.y, 500, 40).fill('#fee2e2');
    doc.fillColor('#991b1b').fontSize(10).text('CRITICAL: HealthGuard AI is a Clinical Decision Support (CDS) aid. It is NOT a substitute for professional clinical judgment. Diagnostic responsibility remains with the attending clinician.', 60, doc.y + 10, { align: 'center', width: 480 });

    doc.end();
}

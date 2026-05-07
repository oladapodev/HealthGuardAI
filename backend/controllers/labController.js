import { extractTextFromFile, parseLabText } from "../utils/parser.js";

export const analyzeLabFile = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        console.log("📄 Processing File:", file.originalname);
        const text = await extractTextFromFile(file.buffer, file.mimetype);
        const labResults = parseLabText(text);

        return res.json({
            success: true,
            message: "File analyzed successfully",
            extractedText: text.substring(0, 500) + "...", // Snippet for feedback
            parsedResults: labResults,
            file: {
                name: file.originalname,
                type: file.mimetype,
                size: file.size
            }
        });

    } catch (err) {
        console.error("Lab Analysis Error:", err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};
import { body } from "express-validator";

export const analyzeHealthDto = [
  body("location").optional().isString().withMessage("Location must be a string"),
  body("text").optional().isString().withMessage("Text must be a string"),
  body("message").optional().isString().withMessage("Message must be a string"),
  body("conversationId").optional().isUUID().withMessage("conversationId must be a valid UUID"),
  body("title").optional().isString().withMessage("Title must be a string"),
  body("symptoms")
    .optional()
    .custom((value) => {
      if (typeof value === "string" || Array.isArray(value)) {
        return true;
      }
      throw new Error("Symptoms must be a string or array");
    }),
  body("age").optional().isInt({ min: 0 }).withMessage("Age must be a positive integer"),
  body("gender").optional().isString().withMessage("Gender must be a string"),
  body("labResults").optional().isObject().withMessage("Lab results must be an object"),
  body("manualLabResults").optional().isObject().withMessage("Manual lab results must be an object"),
  body("menstrualCycle").optional().isObject().withMessage("Menstrual cycle must be an object"),
];

export const chatDto = [
  body("text").optional().isString().withMessage("Text must be a string"),
  body("message").optional().isString().withMessage("Message must be a string"),
  body("location").optional().isString().withMessage("Location must be a string"),
  body("intent")
    .optional()
    .isIn(["chat", "full_analysis", "doctor_note"])
    .withMessage("Intent must be chat, full_analysis, or doctor_note"),
  body("runAnalysis").optional().isBoolean().withMessage("runAnalysis must be a boolean"),
  body("labResults").optional().isObject().withMessage("Lab results must be an object"),
  body("manualLabResults").optional().isObject().withMessage("Manual lab results must be an object"),
  body("menstrualCycle").optional().isObject().withMessage("Menstrual cycle must be an object"),
  body("symptoms")
    .optional()
    .custom((value) => {
      if (typeof value === "string" || Array.isArray(value)) return true;
      throw new Error("Symptoms must be a string or array");
    }),
  body().custom((value) => {
    if (value.text || value.message || value.symptoms || value.runAnalysis) return true;
    throw new Error("Provide text, message, or symptoms");
  }),
];

export const downloadReportDto = [
  body("structured").isObject().withMessage("Structured analysis data is required"),
  body("insight").optional().isString().withMessage("Insight must be a string"),
  body("colorCodedLabs")
    .optional()
    .isObject()
    .withMessage("colorCodedLabs must be an object"),
  body("clinicianSummary")
    .optional()
    .isObject()
    .withMessage("clinicianSummary must be an object"),
];

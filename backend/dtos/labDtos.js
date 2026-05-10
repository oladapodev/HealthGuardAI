import { body } from "express-validator";

export const labUploadDto = [
  body("metadata").optional().custom((value) => {
    if (typeof value === "string" || typeof value === "object") return true;
    throw new Error("metadata must be a JSON object or JSON string");
  }),
];

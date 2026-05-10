import { param, query } from "express-validator";

export const uuidParamDto = [
  param("id").isUUID().withMessage("id must be a valid UUID"),
];

export const listQueryDto = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be an integer between 1 and 100"),
];

import { body } from "express-validator";

export const registerUserDto = [
  body("email").isEmail().withMessage("A valid email is required"),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("profile").optional().isObject().withMessage("Profile must be an object"),
];

export const loginUserDto = [
  body("email").isEmail().withMessage("A valid email is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];

export const updateProfileDto = [
  body("profile").isObject().withMessage("Profile must be an object"),
  body("profile.age").optional().isInt({ min: 0, max: 130 }).withMessage("Age must be between 0 and 130"),
  body("profile.gender")
    .optional()
    .isIn(["male", "female", "other", "prefer_not_to_say", "Male", "Female", "Other", "Prefer not to say"])
    .withMessage("Gender must be male, female, other, or prefer_not_to_say"),
  body("profile.conditions").optional().isArray().withMessage("Conditions must be an array"),
  body("profile.allergies").optional().isArray().withMessage("Allergies must be an array"),
  body("profile.medications").optional().isArray().withMessage("Medications must be an array"),
];

export const dailyCheckinDto = [
  body("log").isObject().withMessage("Log must be an object"),
  body("log.mood").optional().isString().withMessage("Mood must be a string"),
  body("log.notes").optional().isString().withMessage("Notes must be a string"),
  body("log.symptoms")
    .optional()
    .isArray()
    .withMessage("Symptoms must be an array"),
  body("log.foodTags").optional().isArray().withMessage("Food tags must be an array"),
  body("log.sleep").optional().isObject().withMessage("Sleep must be an object"),
  body("log.exercise").optional().isObject().withMessage("Exercise must be an object"),
];

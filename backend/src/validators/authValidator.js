const { body, oneOf } = require("express-validator");
const { AuthSchema, MerchantSchema } = require("../models/Auth");

const validatePasswordPresent = [
  body("password", "password is required").notEmpty(),
];

const validateEmailPresent = [
  body("email", "email is required").notEmpty(),
  body("email", "email must be valid").isEmail(),
];

const validateRefresh = [
  body("refresh", "refresh token is required").notEmpty(),
  body("refresh", "refresh token needs to be JWT format").isJWT(),
];

const validateUserRegistration = [
  body("email", "email is required").notEmpty(),
  body("email", "email must be valid").isEmail(),
  body("password", "password is required").notEmpty(),
  body(
    "password",
    "password has to be minimum 8 characters, contains lowercase, uppercase characters and a symbol"
  ).isStrongPassword({
    minLength: 8,
    minLowerCase: 1,
    minUpperCase: 1,
    minSymbols: 1,
    returnScore: false,
    pointsPerUnique: 2,
    pointsPerRepeat: 1,
  }),
  body("role", "role is required").notEmpty(),
  body("role").custom(async (value) => {
    const roles = await AuthSchema.path("accountType").enumValues;
    result = roles.includes(value);
    if (result) {
      return true;
    } else {
      throw new Error("role has to be either user or merchant");
    }
  }),
];

const validateMerchantRegistration = [
  body("address", "address is required").notEmpty(),
  body(
    "address",
    "address length needs to be between 8-100 characters"
  ).isLength({ min: 8, max: 100 }),
  body("area", "area is required").notEmpty(),
  body("area").custom(async (value) => {
    const areas = await MerchantSchema.path("area").enumValues;
    result = areas.includes(value);
    if (result) {
      return true;
    } else {
      throw new Error("area has to be in enum list");
    }
  }),
  body("description", "description is required").notEmpty(),
  body("name", "name is required").notEmpty(),
  body("name", "name has to be 3 - 50 characters long").isLength({
    min: 3,
    max: 50,
  }),
  body("coordinates", "coordinates cannot be empty").optional().notEmpty(),
  body("image", "image cannot be empty").optional().notEmpty(),
  body("image", "image has to be valid URL").optional().isURL(),
  body("latitude", "latitude is required").notEmpty(),
  body("latitude", "latitude must be -90 to 90").isNumeric({
    min: -90,
    max: 90,
  }),
  body("longitude", "longitude is required").notEmpty(),
  body("longitude", "longitude must be -180 to 180").isNumeric({
    min: -180,
    max: 180,
  }),
];

const validateAllRegistration = oneOf(
  [
    [
      // User registration validations
      ...validateUserRegistration,
      body("role").custom((value) => {
        if (value === "merchant") {
          throw new Error("Invalid role for this registration");
        }
        return true;
      }),
    ],
    [
      // Merchant registration validations
      ...validateUserRegistration,
      ...validateMerchantRegistration,
      body("role").custom((value) => {
        if (value !== "merchant") {
          throw new Error("Invalid role for this registration");
        }
        return true;
      }),
    ],
  ],
  "Invalid registration data"
);

const validatePasswordStrength = [
  body(
    "password",
    "password has to be minimum 8 characters, contains lowercase, uppercase characters and a symbol"
  ).isStrongPassword({
    minLength: 8,
    minLowerCase: 1,
    minUpperCase: 1,
    minSymbols: 1,
    returnScore: false,
    pointsPerUnique: 2,
    pointsPerRepeat: 1,
  }),
];

module.exports = {
  validatePasswordPresent,
  validateEmailPresent,
  validateRefresh,
  validateUserRegistration,
  validateMerchantRegistration,
  validatePasswordStrength,
  validateAllRegistration,
};

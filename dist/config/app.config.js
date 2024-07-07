"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joiValidatorOptions = exports.ENVIRONMENTS = void 0;
const joiValidatorOptions = {
    errors: {
        wrap: {
            label: "",
        },
    },
    stripUnknown: true,
    abortEarly: false,
    allowUnknown: false,
};
exports.joiValidatorOptions = joiValidatorOptions;
const ENVIRONMENTS = Object.freeze({
    PROD: "production",
    DEV: "development",
    UAT: "user acceptance testing",
    STAGING: "staging",
});
exports.ENVIRONMENTS = ENVIRONMENTS;

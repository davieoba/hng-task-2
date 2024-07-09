"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredField = exports.badRequestError = exports.UNABLE_TO_COMPLETE_REQUEST = exports.REGISTRATION_UNSUCCESSFUL = exports.INVALID_TOKEN = exports.INVALID_PERMISSION = exports.DUPLICATE_EMAIL = exports.CLIENT_ERROR = exports.BAD_REQUEST = exports.AUTHENTICATION_FAILED = void 0;
const badRequestError = (message) => {
    return {
        response_code: 1,
        message: message,
    };
};
exports.badRequestError = badRequestError;
const INVALID_PERMISSION = Object.freeze({
    response_code: 2,
    message: "Sorry you do not have permission to perform this action",
});
exports.INVALID_PERMISSION = INVALID_PERMISSION;
const DUPLICATE_EMAIL = Object.freeze({
    response_code: 3,
    message: "This email already exists, please login!",
});
exports.DUPLICATE_EMAIL = DUPLICATE_EMAIL;
const UNABLE_TO_COMPLETE_REQUEST = Object.freeze({
    response_code: 4,
    message: "Unable to complete request.",
});
exports.UNABLE_TO_COMPLETE_REQUEST = UNABLE_TO_COMPLETE_REQUEST;
const REGISTRATION_UNSUCCESSFUL = Object.freeze({
    response_code: 5,
    message: "Registration unsuccessful",
});
exports.REGISTRATION_UNSUCCESSFUL = REGISTRATION_UNSUCCESSFUL;
const AUTHENTICATION_FAILED = Object.freeze({
    response_code: 6,
    message: "Authentication failed",
});
exports.AUTHENTICATION_FAILED = AUTHENTICATION_FAILED;
const requiredField = (field) => {
    return {
        response_code: 7,
        message: field + " is required",
    };
};
exports.requiredField = requiredField;
const BAD_REQUEST = Object.freeze({
    response_code: 8,
    message: "Bad Request",
});
exports.BAD_REQUEST = BAD_REQUEST;
const INVALID_TOKEN = Object.freeze({
    response_code: 9,
    message: "Invalid Token",
});
exports.INVALID_TOKEN = INVALID_TOKEN;
const CLIENT_ERROR = Object.freeze({
    response_code: 10,
    message: "Client error",
});
exports.CLIENT_ERROR = CLIENT_ERROR;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = this.statusCode.toString().startsWith("4") ? "Error" : "Fail";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorController = void 0;
const app_error_1 = __importDefault(require("../libs/app-error"));
const sendErrorDev = (err, _req, res) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "fail";
    res.status(statusCode).json({
        status,
        error: err,
        message: err.message,
        stackTrace: err.stack,
    });
};
const sendErrorProd = (err, req, res) => {
    // trusted error, send it to the client
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};
const handleValidationError = (err) => {
    const errData = Object.values(err.errors).map((el) => {
        return el.message;
    });
    const message = errData.join("...,");
    return new app_error_1.default(message, 404);
};
const errorController = (err, req, res) => {
    if (process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test") {
        sendErrorDev(err, req, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let error = Object.assign({}, err);
        if (err.name === "ValidationError") {
            error = handleValidationError(err);
        }
        sendErrorProd(error, req, res);
    }
};
exports.errorController = errorController;

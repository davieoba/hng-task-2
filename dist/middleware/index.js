"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = exports.authLimiter = exports.restrictTo = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app_error_1 = __importDefault(require("../extensions/libs/app-error"));
const restrictTo = (...roles) => {
    return (req, _res, next) => {
        if (!req.user || !roles.includes(req === null || req === void 0 ? void 0 : req.user.role)) {
            return next(new app_error_1.default("You do not have permission to perform this action", 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 2 * 60 * 1000,
    limit: 7,
    standardHeaders: "draft-7",
    legacyHeaders: false,
});
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: (res) => {
        return res.status(429).json({
            message: "Too many requests",
        });
    },
});

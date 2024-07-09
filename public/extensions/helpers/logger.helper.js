"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const info = (...params) => {
    if (process.env.NODE_ENV === "test")
        return;
    console.info(...params);
};
const error = (...params) => {
    if (process.env.NODE_ENV === "test")
        return;
    console.error(...params);
};
exports.logger = {
    info,
    error,
};

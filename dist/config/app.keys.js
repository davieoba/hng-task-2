"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const Env = {
    PORT: Number(process.env.PORT),
    API_PATH: "/api/" + process.env.API_VERSION,
    API_VERSION: process.env.API_VERSION,
    ALLOWED_ORIGINS: (_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(", "),
    ENVIRONMENT: process.env.ENVIRONMENT,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_USER: process.env.POSTGRES_USER,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    JWT_SECRET: process.env.JWT_SECRET,
};
exports.default = Env;

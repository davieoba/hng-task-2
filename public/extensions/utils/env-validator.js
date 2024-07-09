"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const app_config_1 = require("../../config/app.config");
const app_keys_1 = __importDefault(require("../../config/app.keys"));
function validateEnvironmentVariables() {
    try {
        const EnvSchema = joi_1.default.object({
            ENVIRONMENT: joi_1.default
                .string()
                .valid(...Object.values(app_config_1.ENVIRONMENTS))
                .required(),
            PORT: joi_1.default.number().required(),
            ALLOWED_ORIGINS: joi_1.default.array().items(joi_1.default.string()).min(1).required(),
            API_VERSION: joi_1.default.string(),
            API_PATH: joi_1.default.string().required(),
            POSTGRES_DB: joi_1.default.string().required(),
            POSTGRES_HOST: joi_1.default.string().required(),
            POSTGRES_PASSWORD: joi_1.default.string().required(),
            POSTGRES_URL: joi_1.default.string().required(),
            POSTGRES_USER: joi_1.default.string().required(),
            JWT_EXPIRY: joi_1.default.string().required(),
            JWT_SECRET: joi_1.default.string().required(),
        });
        const response = EnvSchema.validate(app_keys_1.default);
        if (response.error) {
            throw new Error(`Env validation error: ${response.error.details
                .map((x) => x.message)
                .join(", ")}`);
        }
    }
    catch (error) {
        throw error;
    }
}
exports.default = validateEnvironmentVariables;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
const app_config_1 = require("./config/app.config");
const app_keys_1 = __importDefault(require("./config/app.keys"));
const logger_helper_1 = require("./extensions/helpers/logger.helper");
const env_validator_1 = __importDefault(require("./extensions/utils/env-validator"));
(0, env_validator_1.default)();
App_1.default.listen(app_keys_1.default.PORT, () => {
    if (app_keys_1.default.ENVIRONMENT === app_config_1.ENVIRONMENTS.DEV) {
        logger_helper_1.logger.info(`Express is listening on http://localhost:${app_keys_1.default.PORT}${app_keys_1.default.API_PATH}`);
    }
});
process.on("unhandledRejection", (reason, p) => {
    logger_helper_1.logger.error("Unhandled Rejection at:\n", p);
    console.log("\n");
    logger_helper_1.logger.error("Reason:\n", reason);
    //Track error with error logger
    process.exit(1);
    //Restart with pm2 in production
});
process.on("uncaughtException", (error) => {
    logger_helper_1.logger.error(`Uncaught exception:`);
    console.log("\n");
    logger_helper_1.logger.error(error);
    //Track error with error logger
    process.exit(1);
    //Restart with pm2 in production
});

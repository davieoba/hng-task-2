"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const request_utils_1 = __importDefault(require("../../extensions/utils/request.utils"));
const app_validator_middleware_1 = __importDefault(require("../../middleware/app-validator.middleware"));
const user_middleware_1 = __importDefault(require("../../middleware/user.middleware"));
const BaseResponseHandler_controller_1 = __importDefault(require("./BaseResponseHandler.controller"));
class BaseApiController extends BaseResponseHandler_controller_1.default {
    constructor() {
        super();
        this.router = express_1.default.Router();
        this.appValidator = new app_validator_middleware_1.default(this.router);
        this.userMiddleware = new user_middleware_1.default(this.router);
        this.requestUtils = new request_utils_1.default(this.router);
        this.initializeServices();
        this.initializeMiddleware();
        this.initializeRoutes();
    }
}
exports.default = BaseApiController;

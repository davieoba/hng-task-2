"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseResponseHandler_controller_1 = __importDefault(require("../../controllers/base-controllers/BaseResponseHandler.controller"));
const request_utils_1 = __importDefault(require("../../extensions/utils/request.utils"));
/**
 * An abstract class that provides a base middleware for all routers.
 */
class BaseRouterMiddleware extends BaseResponseHandler_controller_1.default {
    constructor(appRouter) {
        super();
        this.router = appRouter;
        this.requestUtils = new request_utils_1.default(appRouter);
    }
}
exports.default = BaseRouterMiddleware;

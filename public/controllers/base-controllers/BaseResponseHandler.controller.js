"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_helper_1 = require("../../extensions/helpers/logger.helper");
const http_status_code_1 = __importDefault(require("../../extensions/utils/http-status-code"));
class BaseResponseHandler {
    sendErrorResponse(res, err, responseMessage, statusCode, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                status: http_status_code_1.default[statusCode],
                message: responseMessage.message,
                statusCode: statusCode,
                data,
            };
            if (statusCode === 500)
                logger_helper_1.logger.error(response.message, "\n" + res, "\n" + err);
            res.status(statusCode).json(response);
        });
    }
    sendSuccessResponse(res_1, message_1) {
        return __awaiter(this, arguments, void 0, function* (res, message, data = null, statusCode = 200) {
            const response = {
                status: http_status_code_1.default[statusCode],
                // statusCode: statusCode,
                message: message,
                data,
            };
            res.status(statusCode).json(response);
        });
    }
}
exports.default = BaseResponseHandler;

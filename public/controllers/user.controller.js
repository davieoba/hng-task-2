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
const app_constants_1 = __importDefault(require("../config/app.constants"));
const error_response_message_1 = require("../extensions/utils/error-response-message");
const BaseApiController_controller_1 = __importDefault(require("./base-controllers/BaseApiController.controller"));
class UserController extends BaseApiController_controller_1.default {
    constructor() {
        super();
    }
    initializeServices() { }
    initializeMiddleware() { }
    initializeRoutes() {
        this.getMyRecord("/:id");
    }
    getMyRecord(path) {
        this.router.get(path);
        this.router.get(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const user = this.requestUtils.getDataFromState(app_constants_1.default.USER_LABEL);
                if (id !== user.userId) {
                    return this.sendErrorResponse(res, new Error("Authentication Failed"), error_response_message_1.BAD_REQUEST, 401);
                }
                return this.sendSuccessResponse(res, "OK", user, 200);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.BAD_REQUEST, 400);
            }
        }));
    }
}
exports.default = UserController;

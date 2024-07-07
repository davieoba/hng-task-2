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
const db_1 = __importDefault(require("../db"));
const auth_utils_1 = require("../extensions/utils/auth.utils");
const error_response_message_1 = require("../extensions/utils/error-response-message");
const base_router_middleware_1 = __importDefault(require("./base-middleware/base-router.middleware"));
class UserMiddleware extends base_router_middleware_1.default {
    constructor(appRouter) {
        super(appRouter);
        this.hashNewPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userPassword = yield (0, auth_utils_1.hashData)(req.body.password);
                req.body.password = userPassword;
                next();
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        });
        // load the user from the db and attach the user to the request body
        this.loadUserToRequestBodyByEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            if (!email) {
                const error = new Error("Email is required");
                return this.sendErrorResponse(res, error, (0, error_response_message_1.requiredField)("email"), 400);
            }
            const user = yield db_1.default.query.Users.findFirst({
                where(users, { eq }) {
                    return eq(users.email, email);
                },
            });
            if (!user)
                return this.sendErrorResponse(res, new Error("Authentication Failed"), error_response_message_1.BAD_REQUEST, 401);
            // attach the user to the request object
            this.requestUtils.addDataToState(app_constants_1.default.USER_LABEL, user);
            this.requestUtils.addDataToState(app_constants_1.default.USER_PASSWORD_LABEL, user.password);
            next();
        });
        // continue implementation
        this.validatePassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let userPassword = this.requestUtils.getDataFromState(app_constants_1.default.USER_PASSWORD_LABEL);
                const isCorrectPassword = yield (0, auth_utils_1.validateHashedData)(req.body.password, userPassword);
                if (!isCorrectPassword) {
                    return this.sendErrorResponse(res, new Error("Authentication Failed"), error_response_message_1.BAD_REQUEST, 401);
                }
                next();
            }
            catch (error) {
                return this.sendErrorResponse(res, new Error("Authentication Failed"), error_response_message_1.BAD_REQUEST, 401);
            }
        });
    }
}
exports.default = UserMiddleware;

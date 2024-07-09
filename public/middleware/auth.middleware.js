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
class AuthMiddleware extends base_router_middleware_1.default {
    constructor(appRouter) {
        super(appRouter);
        this.authGuard = this.authGuard.bind(this);
    }
    authGuard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jwt = (0, auth_utils_1.getTokenFromRequest)(req);
                const decoded = yield (0, auth_utils_1.verifyJwtToken)(jwt);
                if (!decoded.data) {
                    const error = new Error("Invalid credentials");
                    return this.sendErrorResponse(res, error, error_response_message_1.INVALID_TOKEN, 401);
                }
                const user = yield db_1.default.query.Users.findFirst({
                    where(Users, { eq }) {
                        return eq(Users.userId, decoded.data);
                    },
                });
                this.requestUtils.addDataToState(app_constants_1.default.USER_LABEL, user);
                next();
            }
            catch (error) {
                const err = new Error("Invalid Token");
                this.sendErrorResponse(res, err, error_response_message_1.INVALID_TOKEN, 401);
            }
        });
    }
}
exports.default = AuthMiddleware;

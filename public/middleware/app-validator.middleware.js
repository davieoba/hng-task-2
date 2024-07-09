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
const joi_1 = __importDefault(require("joi"));
const app_config_1 = require("../config/app.config");
const db_1 = __importDefault(require("../db"));
const error_response_message_1 = require("../extensions/utils/error-response-message");
const base_router_middleware_1 = __importDefault(require("./base-middleware/base-router.middleware"));
class AppValidator extends base_router_middleware_1.default {
    constructor(appRouter) {
        super(appRouter);
        this.validateUserSignup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const UserSignupSchema = joi_1.default.object({
                    firstName: joi_1.default.string().max(256).required(),
                    lastName: joi_1.default.string().max(256).required(),
                    email: joi_1.default.string().email().required(),
                    password: joi_1.default.string().required(),
                    phone: joi_1.default.string().max(50),
                });
                yield UserSignupSchema.validateAsync(req.body, app_config_1.joiValidatorOptions);
                const existingUser = yield db_1.default.query.Users.findFirst({
                    where(Users, { eq }) {
                        return eq(Users.email, req.body.email);
                    },
                });
                if (existingUser) {
                    const error = new Error("A user with this email already exists");
                    return this.sendErrorResponse(res, error, error_response_message_1.DUPLICATE_EMAIL, 422);
                }
                next();
            }
            catch (error) {
                return this.sendErrorResponse(res, error, (0, error_response_message_1.badRequestError)(error.message), 422);
            }
        });
        this.validateOrganization = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const OrganizationCreateSchema = joi_1.default.object({
                    name: joi_1.default.string().required(),
                    description: joi_1.default.string().required(),
                });
                yield OrganizationCreateSchema.validateAsync(req.body, app_config_1.joiValidatorOptions);
                next();
            }
            catch (error) {
                this.sendErrorResponse(res, new Error("Bad Request"), error_response_message_1.CLIENT_ERROR, 422);
            }
        });
    }
}
exports.default = AppValidator;

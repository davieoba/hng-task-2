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
const db_schema_1 = require("../db/schema/db.schema");
const error_response_message_1 = require("../extensions/utils/error-response-message");
const success_response_message_1 = __importDefault(require("../extensions/utils/success-response-message"));
const user_service_1 = __importDefault(require("../services/user.service"));
const BaseApiController_controller_1 = __importDefault(require("./base-controllers/BaseApiController.controller"));
const org_controller_1 = __importDefault(require("./org.controller"));
class AuthController extends BaseApiController_controller_1.default {
    constructor() {
        super();
        // this.appValidator = new AppValidator(this.router)
        this.initializeRoutes();
        this.organizationController = new org_controller_1.default();
    }
    initializeServices() { }
    initializeMiddleware() { }
    initializeRoutes() {
        this.login("/login"); // POST
        this.signup("/register"); // POST
    }
    signup(path) {
        var _a;
        this.router.post(path, (_a = this.appValidator) === null || _a === void 0 ? void 0 : _a.validateUserSignup, this.userMiddleware.hashNewPassword);
        this.router.post(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const userData = {
                    firstName: body.firstName,
                    lastName: body.lastName,
                    email: body.email,
                    password: body.password,
                    phone: body.phone,
                };
                const user = yield db_1.default
                    .insert(db_schema_1.Users)
                    .values(userData)
                    .returning();
                if (!user) {
                    const error = new Error("Unable to create User");
                    return this.sendErrorResponse(res, error, error_response_message_1.REGISTRATION_UNSUCCESSFUL, 400);
                }
                // CREATE AN ORGANIZATION
                yield this.organizationController.createOrganization(user[0].firstName, user[0].userId);
                // CREATE TOKEN
                const token = yield new user_service_1.default().loginUser(user[0].userId);
                const newUser = user[0];
                const response = {
                    accessToken: token,
                    user: {
                        userId: newUser.userId,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        email: newUser.email,
                        phone: newUser.phone,
                    },
                };
                return this.sendSuccessResponse(res, success_response_message_1.default.SIGNUP_SUCCESSFUL, response, 201);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.REGISTRATION_UNSUCCESSFUL, 500, {});
            }
        }));
    }
    login(path) {
        this.router.post(path, this.userMiddleware.loadUserToRequestBodyByEmail, this.userMiddleware.validatePassword);
        this.router.post(path, (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.requestUtils.getDataFromState(app_constants_1.default.USER_LABEL);
                const token = yield new user_service_1.default().loginUser(user.userId);
                const response = {
                    accessToken: token,
                    user: {
                        userId: user.userId,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone,
                    },
                };
                return this.sendSuccessResponse(res, success_response_message_1.default.LOGIN_SUCCESSFUL, response, 200);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.BAD_REQUEST, 401);
            }
        }));
    }
}
exports.default = AuthController;

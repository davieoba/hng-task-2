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
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const app_constants_1 = __importDefault(require("../../../config/app.constants"));
const auth_controller_1 = __importDefault(require("../../../controllers/auth.controller"));
const request_utils_1 = __importDefault(require("../../../extensions/utils/request.utils"));
const app_validator_middleware_1 = __importDefault(require("../../../middleware/app-validator.middleware"));
const user_middleware_1 = __importDefault(require("../../../middleware/user.middleware"));
const user_service_1 = __importDefault(require("../../../services/user.service"));
const newUser = {
    firstName: "John",
    lastName: "Doe",
    email: "johnnybegood2@email.com",
    password: "hidden",
    phone: "+234810474",
};
describe("AuthController", () => {
    let app;
    let controller;
    let validator;
    let userService;
    let userMiddleware;
    let requestUtils;
    beforeAll(() => {
        app = (0, express_1.default)();
        controller = new auth_controller_1.default();
        validator = new app_validator_middleware_1.default(app);
        userService = new user_service_1.default();
        userMiddleware = new user_middleware_1.default(app);
        requestUtils = new request_utils_1.default(app);
        // routes
        controller.signup("/auth/register");
        controller.login("/auth/login");
        app.use(express_1.default.json());
        app.use("/", controller.router);
        controller.appValidator = validator;
    });
    describe("POST /auth/register", () => {
        it("should register a new user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post("/auth/register")
                .send(newUser)
                .expect(201);
            expect(response.body.data).toHaveProperty("accessToken");
            expect(response.body.data).toHaveProperty("user");
            expect(response.body.data.organizationName).toBe("John's organization");
        }));
        it("should log the user in successfully with valid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
            jest
                .spyOn(userMiddleware, "loadUserToRequestBodyByEmail")
                .mockImplementation((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                requestUtils.addDataToState(app_constants_1.default.USER_LABEL, newUser);
                next();
            }));
            jest
                .spyOn(userMiddleware, "validatePassword")
                .mockImplementation((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const isValidPassword = req.body.password === newUser.password;
                if (!isValidPassword) {
                    throw new Error("Invalid credentials");
                }
                next();
            }));
            // $2a$12$iLA03fx9NvGwBomGylEfYuyvXgR9jMAkvjxoKCO1X3h0l3EWoZuvq
            jest
                .spyOn(userService, "loginUser")
                .mockResolvedValue("mocked_access_token");
            const response = yield (0, supertest_1.default)(app)
                .post("/auth/login")
                .send({
                email: newUser.email,
                password: newUser.password,
            })
                .expect(200);
            expect(response.body.data).toHaveProperty("accessToken");
            expect(response.body.data.user.firstName).toBe(newUser.firstName);
        }));
        it("should fail if a required field is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const incompleteUser = {
                firstName: "charlie",
                lastName: "boy",
                // email: "charlie-boy@yahoo.com",
                phone: "+234-109211",
            };
            const response = yield (0, supertest_1.default)(app)
                .post("/auth/register")
                .send(incompleteUser)
                .expect(422);
            console.log(response.body);
        }));
    });
});

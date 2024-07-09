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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = __importDefault(require("../user.service"));
const JWT_SECRET = "hidden-leaf";
describe("User service", () => {
    let userService;
    beforeAll(() => {
        userService = new user_service_1.default();
    });
    describe("login user", () => {
        it("should return a valid JWT token with a correct user details", () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = "test0-id";
            const token = yield userService.loginUser(userId);
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            expect(decoded.data).toBe(userId);
            const currentTime = Math.floor(Date.now() / 1000);
            const expiryTime = decoded.exp;
            const expectedExpiryTime = currentTime + 3600;
            expect(Math.abs(expectedExpiryTime - expiryTime)).toBeLessThan(5);
        }));
    });
});

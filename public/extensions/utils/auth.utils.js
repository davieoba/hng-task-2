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
exports.verifyJwtToken = exports.validateHashedData = exports.hashData = exports.getTokenFromRequest = exports.createAuthToken = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_keys_1 = __importDefault(require("../../config/app.keys"));
const hashData = (data_1, ...args_1) => __awaiter(void 0, [data_1, ...args_1], void 0, function* (data, rounds = 12) {
    const salt = yield bcryptjs_1.default.genSalt(rounds);
    return bcryptjs_1.default.hash(data, salt);
});
exports.hashData = hashData;
const createAuthToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return jsonwebtoken_1.default.sign({ data: userId }, app_keys_1.default.JWT_SECRET, {
            expiresIn: app_keys_1.default.JWT_EXPIRY,
        });
    }
    catch (error) {
        throw error;
    }
});
exports.createAuthToken = createAuthToken;
const validateHashedData = (value, hashedData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.compare(value, hashedData);
});
exports.validateHashedData = validateHashedData;
const getTokenFromRequest = (req) => {
    let jwt = "";
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer") &&
        req.headers.authorization.split(" ").length > 1) {
        jwt = req.headers.authorization.split(" ")[1];
    }
    return jwt;
};
exports.getTokenFromRequest = getTokenFromRequest;
const verifyJwtToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decoded = null;
    try {
        decoded = (yield jsonwebtoken_1.default.verify(token, app_keys_1.default.JWT_SECRET));
        // if (!decoded) {
        //   throw new Error("Invalid Token")
        // }
        return decoded;
    }
    catch (err) {
        throw err;
    }
});
exports.verifyJwtToken = verifyJwtToken;

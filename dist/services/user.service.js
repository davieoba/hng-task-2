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
Object.defineProperty(exports, "__esModule", { value: true });
const auth_utils_1 = require("../extensions/utils/auth.utils");
class UserService {
    constructor() { }
    loginUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // you can create user login session and save it to the database
                // you can also send the login session to the createAuthToken as part of the payload
                return (0, auth_utils_1.createAuthToken)(userId);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UserService;

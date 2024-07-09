"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_keys_1 = __importDefault(require("../config/app.keys"));
const org_controller_1 = __importDefault(require("../controllers/org.controller"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
class AppRoutes {
    constructor(app) {
        this.app = app;
        this.userController = new user_controller_1.default();
        this.organizationController = new org_controller_1.default();
    }
    initializeRoutes() {
        this.app.use(app_keys_1.default.API_PATH + "/users", this.userController.router);
        this.app.use(app_keys_1.default.API_PATH + "/organizations", this.organizationController.router);
    }
}
exports.default = AppRoutes;
/**
 *     // USER ROUTER
    this.app.use(Env.API_PATH, new UserController().router)

 */

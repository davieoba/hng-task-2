"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_keys_1 = __importDefault(require("./config/app.keys"));
const auth_controller_1 = __importDefault(require("./controllers/auth.controller"));
const auth_middleware_1 = __importDefault(require("./middleware/auth.middleware"));
const app_routes_1 = __importDefault(require("./routes/app.routes"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.appRoutes = new app_routes_1.default(this.app);
        this.authMiddleware = new auth_middleware_1.default(this.app);
        this.plugInMiddlewares();
        this.plugInRoutes();
    }
    plugInMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    plugInRoutes() {
        this.app.get("/", (_req, res) => {
            res.status(200).send("<h1>Successful</h1>");
        });
        this.app.get(app_keys_1.default.API_PATH + "/health", (req, res) => {
            const response = "Server is healthy___  " + new Date().toUTCString();
            res.status(200).send(response);
        });
        this.app.use("/auth", new auth_controller_1.default().router);
        //  Load Authentication MiddleWare
        this.app.use(app_keys_1.default.API_PATH, this.authMiddleware.authGuard);
        // these are protected routes so I will add a middleware before it like an auth guard
        this.appRoutes.initializeRoutes();
        this.app.all("*", (_req, res) => {
            res.status(404).send("RESOURCE NOT FOUND");
        });
    }
}
exports.default = new App().app;

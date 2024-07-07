"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const app_keys_1 = __importDefault(require("../config/app.keys"));
const schema = __importStar(require("./schema/db.schema"));
if (!app_keys_1.default.POSTGRES_HOST ||
    !app_keys_1.default.POSTGRES_DB ||
    !app_keys_1.default.POSTGRES_PASSWORD ||
    !app_keys_1.default.POSTGRES_URL) {
    throw new Error("Database credentials missing.");
}
const pool = new pg_1.Pool({
    port: 5432,
    host: app_keys_1.default.POSTGRES_HOST,
    user: app_keys_1.default.POSTGRES_USER,
    password: app_keys_1.default.POSTGRES_PASSWORD,
    database: app_keys_1.default.POSTGRES_DB,
    connectionString: app_keys_1.default.POSTGRES_URL,
});
const db = (0, node_postgres_1.drizzle)(pool, { schema });
exports.default = db;

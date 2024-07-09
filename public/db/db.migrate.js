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
const node_postgres_1 = require("drizzle-orm/node-postgres");
const migrator_1 = require("drizzle-orm/node-postgres/migrator");
const pg_1 = require("pg");
const app_keys_1 = __importDefault(require("../config/app.keys"));
const logger_helper_1 = require("../extensions/helpers/logger.helper");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(app_keys_1.default.POSTGRES_URL);
        const pool = new pg_1.Pool({
            connectionString: app_keys_1.default.POSTGRES_URL,
        });
        const db = (0, node_postgres_1.drizzle)(pool);
        logger_helper_1.logger.info("[Migrate] migration has started ....");
        yield (0, migrator_1.migrate)(db, { migrationsFolder: "drizzle" });
        logger_helper_1.logger.info("[Migrate] migration ended");
        yield pool.end();
    });
}
main().catch((err) => {
    logger_helper_1.logger.error(err);
});

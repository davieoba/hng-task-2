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
const drizzle_orm_1 = require("drizzle-orm");
const app_constants_1 = __importDefault(require("../config/app.constants"));
const db_1 = __importDefault(require("../db"));
const db_schema_1 = require("../db/schema/db.schema");
const error_response_message_1 = require("../extensions/utils/error-response-message");
const BaseApiController_controller_1 = __importDefault(require("./base-controllers/BaseApiController.controller"));
class OrganizationController extends BaseApiController_controller_1.default {
    constructor() {
        super();
    }
    initializeServices() { }
    initializeMiddleware() { }
    initializeRoutes() {
        this.getUserOrganizations("/"); // GET ALL ORGANIZATION
        this.getAnOrganization("/:id"); // GET A SINGLE ORGANIZATION
        this.userCreateAnOrganization("/"); //  USER CREATE AN ORGANIZATION
        this.addUserToOrganization("/:id/users"); // ADD USER TO AN ORGANIZATION
    }
    createOrganization(name, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orgData = {
                name: `${name}'s organization`,
                userId: userId,
            };
            const organization = yield db_1.default
                .insert(db_schema_1.Organizations)
                .values(orgData)
                .returning();
            const usersToOrgData = {
                organizationId: organization[0].orgId,
                userId: userId,
            };
            yield db_1.default.insert(db_schema_1.usersToOrganizations).values(usersToOrgData).returning();
            return organization;
            // if (!organization) {
            //   const error = new Error("Unable to create Organization")
            //   throw error
            // }
        });
    }
    // GET ALL THE ORGANIZATION THAT THIS USER BELONGS TO
    getUserOrganizations(path) {
        return __awaiter(this, void 0, void 0, function* () {
            this.router.get(path);
            this.router.get(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const local_user = this.requestUtils.getDataFromState(app_constants_1.default.USER_LABEL);
                    const query = yield db_1.default
                        .select({
                        orgId: db_schema_1.Organizations.orgId,
                        name: db_schema_1.Organizations.name,
                    })
                        .from(db_schema_1.Organizations)
                        .innerJoin(db_schema_1.usersToOrganizations, (0, drizzle_orm_1.eq)(db_schema_1.Organizations.orgId, db_schema_1.usersToOrganizations.organizationId))
                        .where((0, drizzle_orm_1.eq)(db_schema_1.usersToOrganizations.userId, local_user.userId));
                    const response = {
                        organizations: [...query],
                    };
                    return this.sendSuccessResponse(res, "OK", response, 200);
                }
                catch (error) {
                    this.sendErrorResponse(res, error, error_response_message_1.BAD_REQUEST, 400);
                }
            }));
        });
    }
    // GET A SINGLE ORGANIZATION
    getAnOrganization(path) {
        return __awaiter(this, void 0, void 0, function* () {
            this.router.get(path);
            this.router.get(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const id = req.params.id;
                try {
                    const organizations = yield db_1.default.query.Organizations.findFirst({
                        where(organizations, { eq }) {
                            return eq(organizations.orgId, id);
                        },
                    });
                    const response = {
                        orgId: organizations === null || organizations === void 0 ? void 0 : organizations.orgId,
                        name: organizations === null || organizations === void 0 ? void 0 : organizations.name,
                        description: organizations === null || organizations === void 0 ? void 0 : organizations.description,
                    };
                    return this.sendSuccessResponse(res, "OK", { data: response });
                }
                catch (error) {
                    this.sendErrorResponse(res, error, error_response_message_1.BAD_REQUEST, 400);
                }
            }));
        });
    }
    //  CREATE NEW ORGANIZATION ENDPOINT
    userCreateAnOrganization(path) {
        return __awaiter(this, void 0, void 0, function* () {
            this.router.post(path, this.appValidator.validateOrganization);
            this.router.post(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = this.requestUtils.getDataFromState(app_constants_1.default.USER_LABEL);
                    const organizationData = {
                        name: req.body.name,
                        description: req.body.description,
                        userId: user.userId,
                    };
                    const organization = yield db_1.default
                        .insert(db_schema_1.Organizations)
                        .values(organizationData)
                        .returning();
                    const usersToOrgData = {
                        organizationId: organization[0].orgId,
                        userId: user.userId,
                    };
                    yield db_1.default.insert(db_schema_1.usersToOrganizations).values(usersToOrgData).returning();
                    return this.sendSuccessResponse(res, "Organisation created successfully", {
                        data: { organization: organization[0] },
                    }, 201);
                }
                catch (error) {
                    this.sendErrorResponse(res, error, error_response_message_1.BAD_REQUEST, 400);
                }
            }));
        });
    }
    // ADD USER TO AN ORGANIZATION
    addUserToOrganization(path) {
        return __awaiter(this, void 0, void 0, function* () {
            this.router.post(path);
            this.router.post(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const id = req.params.id;
                    // CHECK IF THE ORGANIZATION EXISTS
                    const checkIfOrganizationExists = yield db_1.default.query.Organizations.findFirst({
                        where(organizations, { eq }) {
                            return eq(organizations.orgId, String(id));
                        },
                    });
                    if (!checkIfOrganizationExists) {
                        return this.sendErrorResponse(res, new Error("Organization does not exist"), error_response_message_1.BAD_REQUEST, 400);
                    }
                    // CREATE AN INSTANCE ON THE TABLE THAT MATCHES THE USERID ON THE USER_TO_ORGANIZATION TABLE
                    const user = this.requestUtils.getDataFromState(app_constants_1.default.USER_LABEL);
                    const orgData = {
                        userId: user.userId,
                        organizationId: id,
                    };
                    const organization = yield db_1.default
                        .insert(db_schema_1.usersToOrganizations)
                        .values(orgData)
                        .returning();
                    if (!organization) {
                        return this.sendErrorResponse(res, new Error("Error adding user to organization"), error_response_message_1.BAD_REQUEST, 400);
                    }
                    return this.sendSuccessResponse(res, "User added to organisation successfully");
                }
                catch (error) {
                    this.sendErrorResponse(res, error, error_response_message_1.BAD_REQUEST, 400);
                }
            }));
        });
    }
}
exports.default = OrganizationController;

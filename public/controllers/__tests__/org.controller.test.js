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
const express_1 = require("express");
const request_utils_1 = __importDefault(require("../../extensions/utils/request.utils"));
const org_controller_1 = __importDefault(require("../org.controller"));
jest.mock("../../db");
jest.mock("../../extensions/utils/request.utils");
// const mockRequestUtils = require("../../extensions/utils/request.utils")
describe("Organization controller", () => {
    let req;
    let res;
    let controller;
    let requestUtils;
    beforeEach(() => {
        req = {
            params: {},
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        const router = (0, express_1.Router)();
        requestUtils = new request_utils_1.default(router);
        controller = new org_controller_1.default();
    });
    describe("Get user organizations", () => {
        it("should return only the organizations the user has access to", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserOrganizations = [
                { orgId: "org-1", name: "Org A" },
                { orgId: "org-2", name: "Org B" },
            ];
            // jest
            //   .spyOn(requestUtils, "getDataFromState")
            //   .mockReturnValue({ userId: "user-1" })
            // await controller.getUserOrganizations("/")
            // expect(res.status).toHaveBeenCalledWith(200)
            // expect(res.json).toHaveBeenCalledWith({
            //   message: "OK",
            //   data: {
            //     oganizations: mockUserOrganizations,
            //   },
            // })
        }));
    });
});

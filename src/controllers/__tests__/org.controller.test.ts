import { Router } from "express"
import RequestUtils from "../../extensions/utils/request.utils"
import OrganizationController from "../org.controller"

jest.mock("../../db")
jest.mock("../../extensions/utils/request.utils")

// const mockRequestUtils = require("../../extensions/utils/request.utils")

describe("Organization controller", () => {
  let req: any
  let res: any
  let controller: OrganizationController
  let requestUtils: RequestUtils

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }
    const router = Router()
    requestUtils = new RequestUtils(router)
    controller = new OrganizationController()
  })

  describe("Get user organizations", () => {
    it("should return only the organizations the user has access to", async () => {
      const mockUserOrganizations = [
        { orgId: "org-1", name: "Org A" },
        { orgId: "org-2", name: "Org B" },
      ]

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
    })
  })
})

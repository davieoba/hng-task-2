import express, { Application } from "express"
import request from "supertest"
import APP_CONSTANTS from "../../../config/app.constants"
import AuthController from "../../../controllers/auth.controller"
import { NewUserType } from "../../../db/schema/db.schema"
import RequestUtils from "../../../extensions/utils/request.utils"
import AppValidator from "../../../middleware/app-validator.middleware"
import UserMiddleware from "../../../middleware/user.middleware"
import UserService from "../../../services/user.service"

const newUser: NewUserType = {
  firstName: "John",
  lastName: "Doe",
  email: "johnnybegood2@email.com",
  password: "hidden",
  phone: "+234810474",
}

describe("AuthController", () => {
  let app: Application
  let controller: AuthController
  let validator: AppValidator
  let userService: UserService
  let userMiddleware: UserMiddleware
  let requestUtils: RequestUtils

  beforeAll(() => {
    app = express()
    controller = new AuthController()
    validator = new AppValidator(app)
    userService = new UserService()
    userMiddleware = new UserMiddleware(app)
    requestUtils = new RequestUtils(app)

    // routes
    controller.signup("/auth/register")
    controller.login("/auth/login")
    app.use(express.json())
    app.use("/", controller.router)
    controller.appValidator = validator
  })

  describe("POST /auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send(newUser)
        .expect(201)
      expect(response.body.data).toHaveProperty("accessToken")
      expect(response.body.data).toHaveProperty("user")
      expect(response.body.data.organizationName).toBe("John's organization")
    })

    it("should log the user in successfully with valid credentials", async () => {
      jest
        .spyOn(userMiddleware, "loadUserToRequestBodyByEmail")
        .mockImplementation(async (req, res, next) => {
          requestUtils.addDataToState(APP_CONSTANTS.USER_LABEL, newUser)
          next()
        })

      jest
        .spyOn(userMiddleware, "validatePassword")
        .mockImplementation(async (req, res, next) => {
          const isValidPassword = req.body.password === newUser.password
          if (!isValidPassword) {
            throw new Error("Invalid credentials")
          }

          next()
        })

      // $2a$12$iLA03fx9NvGwBomGylEfYuyvXgR9jMAkvjxoKCO1X3h0l3EWoZuvq
      jest
        .spyOn(userService, "loginUser")
        .mockResolvedValue("mocked_access_token")
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: newUser.email,
          password: newUser.password,
        })
        .expect(200)

      expect(response.body.data).toHaveProperty("accessToken")
      expect(response.body.data.user.firstName).toBe(newUser.firstName)
    })

    it("should fail if a required field is missing", async () => {
      const incompleteUser = {
        firstName: "charlie",
        lastName: "boy",
        // email: "charlie-boy@yahoo.com",
        phone: "+234-109211",
      }

      const response = await request(app)
        .post("/auth/register")
        .send(incompleteUser)
        .expect(422)

      console.log(response.body)
    })
  })
})

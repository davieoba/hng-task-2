import APP_CONSTANTS from "../config/app.constants"
import db from "../db"
import { NewUserType, users } from "../db/schema/db.schema"
import {
  BAD_REQUEST,
  REGISTRATION_UNSUCCESSFUL,
} from "../extensions/utils/error-response-message"
import SUCCESS_RESPONSE_MESSAGE from "../extensions/utils/success-response-message"
import UserService from "../services/user.service"
import BaseApiController from "./base-controllers/BaseApiController.controller"

class AuthController extends BaseApiController {
  // appValidator: AppValidator

  constructor() {
    super()
    // this.appValidator = new AppValidator(this.router)
    this.initializeRoutes()
  }

  protected initializeServices(): void {}
  protected initializeMiddleware(): void {}
  protected initializeRoutes(): void {
    this.login("/login") // POST
    this.signup("/register") // POST
  }

  signup(path: string) {
    this.router.post(
      path,
      this.appValidator?.validateUserSignup,
      this.userMiddleware.hashNewPassword
    )
    this.router.post(path, async (req, res) => {
      try {
        const body = req.body
        const userData = {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          password: body.password,
          phone: body.phone,
        }
        const user: NewUserType[] = await db
          .insert(users)
          .values(userData)
          .returning()

        if (!user) {
          const error = new Error("Unable to create User")
          return this.sendErrorResponse(
            res,
            error,
            REGISTRATION_UNSUCCESSFUL,
            400
          )
        }

        const token = await new UserService().loginUser(
          user[0].userId as string
        )
        const response = {
          accessToken: token,
          user,
        }

        return this.sendSuccessResponse(
          res,
          SUCCESS_RESPONSE_MESSAGE.SIGNUP_SUCCESSFUL,
          response,
          200
        )
      } catch (error: any) {
        this.sendErrorResponse(res, error, REGISTRATION_UNSUCCESSFUL, 500, {})
      }
    })
  }

  login(path: string) {
    this.router.post(
      path,
      this.userMiddleware.loadUserToRequestBodyByEmail,
      this.userMiddleware.validatePassword
    )
    this.router.post(path, async (_req, res) => {
      try {
        const user = this.requestUtils.getDataFromState(
          APP_CONSTANTS.USER_LABEL
        )
        const token = await new UserService().loginUser(user.userId)
        const response = {
          accessToken: token,
          user,
        }
        return this.sendSuccessResponse(
          res,
          SUCCESS_RESPONSE_MESSAGE.LOGIN_SUCCESSFUL,
          response,
          200
        )
      } catch (error: any) {
        this.sendErrorResponse(res, error, BAD_REQUEST, 400)
      }
    })
  }
}

export default AuthController

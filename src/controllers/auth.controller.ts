import APP_CONSTANTS from "../config/app.constants"
import db from "../db"
import { NewUserType, Users, UserType } from "../db/schema/db.schema"
import {
  BAD_REQUEST,
  REGISTRATION_UNSUCCESSFUL,
} from "../extensions/utils/error-response-message"
import SUCCESS_RESPONSE_MESSAGE from "../extensions/utils/success-response-message"
import OrganizationService from "../services/organization.service"
import UserService from "../services/user.service"
import BaseApiController from "./base-controllers/BaseApiController.controller"
import OrganizationController from "./org.controller"

class AuthController extends BaseApiController {
  // appValidator: AppValidator
  organizationController: OrganizationController
  organizationService: OrganizationService
  constructor() {
    super()
    // this.appValidator = new AppValidator(this.router)
    this.initializeRoutes()
    this.organizationController = new OrganizationController()
    this.organizationService = new OrganizationService()
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
        const userData: Omit<NewUserType, "userId"> = {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          password: body.password,
          phone: body.phone,
        }
        const user: NewUserType[] = await db
          .insert(Users)
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
        // CREATE AN ORGANIZATION

        const organization = await this.organizationService.createOrganization(
          user[0].firstName,
          user[0].userId as string
        )
        // CREATE TOKEN
        const token = await new UserService().loginUser(
          user[0].userId as string
        )
        const newUser = user[0]
        const organizationName = organization[0].name
        const response = {
          accessToken: token,
          user: {
            userId: newUser.userId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
          },
          organizationName,
        }

        return this.sendSuccessResponse(
          res,
          SUCCESS_RESPONSE_MESSAGE.SIGNUP_SUCCESSFUL,
          response,
          201
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
        const user: UserType = this.requestUtils.getDataFromState(
          APP_CONSTANTS.USER_LABEL
        )
        const token = await new UserService().loginUser(user.userId)
        const response = {
          accessToken: token,
          user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
          },
        }
        return this.sendSuccessResponse(
          res,
          SUCCESS_RESPONSE_MESSAGE.LOGIN_SUCCESSFUL,
          response,
          200
        )
      } catch (error: any) {
        this.sendErrorResponse(res, error, BAD_REQUEST, 401)
      }
    })
  }
}

export default AuthController

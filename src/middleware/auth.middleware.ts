import { NextFunction, Request, Response, Router } from "express"
import APP_CONSTANTS from "../config/app.constants"
import db from "../db"
import {
  getTokenFromRequest,
  verifyJwtToken,
} from "../extensions/utils/auth.utils"
import { INVALID_TOKEN } from "../extensions/utils/error-response-message"
import BaseRouterMiddleware from "./base-middleware/base-router.middleware"

class AuthMiddleware extends BaseRouterMiddleware {
  constructor(appRouter: Router) {
    super(appRouter)
    this.authGuard = this.authGuard.bind(this)
  }

  public async authGuard(req: Request, res: Response, next: NextFunction) {
    try {
      const jwt = getTokenFromRequest(req)
      const decoded = await verifyJwtToken(jwt)
      if (!decoded.data) {
        const error = new Error("Invalid credentials")
        return this.sendErrorResponse(res, error, INVALID_TOKEN, 401)
      }

      const user = await db.query.Users.findFirst({
        where(Users, { eq }) {
          return eq(Users.userId, decoded.data)
        },
      })

      this.requestUtils.addDataToState(APP_CONSTANTS.USER_LABEL, user)

      next()
    } catch (error: any) {
      const err = new Error("Invalid Token")
      this.sendErrorResponse(res, err, INVALID_TOKEN, 401)
    }
  }
}

export default AuthMiddleware

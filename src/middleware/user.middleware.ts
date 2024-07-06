import { NextFunction, Request, Response, Router } from "express"
import APP_CONSTANTS from "../config/app.constants"
import db from "../db"
import { hashData, validateHashedData } from "../extensions/utils/auth.utils"
import {
  BAD_REQUEST,
  requiredField,
  UNABLE_TO_COMPLETE_REQUEST,
} from "../extensions/utils/error-response-message"
import BaseRouterMiddleware from "./base-middleware/base-router.middleware"

class UserMiddleware extends BaseRouterMiddleware {
  constructor(appRouter: Router) {
    super(appRouter)
  }

  public hashNewPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userPassword = await hashData(req.body.password)
      req.body.password = userPassword
      next()
    } catch (error: any) {
      this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500)
    }
  }

  // load the user from the db and attach the user to the request body
  public loadUserToRequestBodyByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const email = req.body.email
    if (!email) {
      const error = new Error("Email is required")
      return this.sendErrorResponse(res, error, requiredField("email"), 400)
    }

    const user = await db.query.users.findFirst({
      where(users, { eq }) {
        return eq(users.email, email)
      },
    })
    if (!user)
      return this.sendErrorResponse(
        res,
        new Error("Authentication Failed"),
        BAD_REQUEST,
        400
      )

    // attach the user to the request object
    this.requestUtils.addDataToState(APP_CONSTANTS.USER_LABEL, user)
    this.requestUtils.addDataToState(
      APP_CONSTANTS.USER_PASSWORD_LABEL,
      user.password
    )
    next()
  }

  // continue implementation
  public validatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let userPassword = this.requestUtils.getDataFromState(
        APP_CONSTANTS.USER_PASSWORD_LABEL
      )

      const isCorrectPassword = await validateHashedData(
        req.body.password,
        userPassword
      )

      if (!isCorrectPassword) {
        return this.sendErrorResponse(
          res,
          new Error("Authentication Failed"),
          BAD_REQUEST,
          400
        )
      }
      next()
    } catch (error) {
      return this.sendErrorResponse(
        res,
        new Error("Authentication Failed"),
        BAD_REQUEST,
        400
      )
    }
  }
}

export default UserMiddleware

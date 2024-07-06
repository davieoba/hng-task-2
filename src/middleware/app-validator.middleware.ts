import { NextFunction, Request, Response, Router } from "express"
import joi from "joi"
import { joiValidatorOptions } from "../config/app.config"
import db from "../db"
import { IUserSignUp } from "../extensions/types/request.type"
import {
  badRequestError,
  DUPLICATE_EMAIL,
} from "../extensions/utils/error-response-message"
import BaseRouterMiddleware from "./base-middleware/base-router.middleware"

class AppValidator extends BaseRouterMiddleware {
  constructor(appRouter: Router) {
    super(appRouter)
  }

  public validateUserSignup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const UserSignupSchema: joi.ObjectSchema<IUserSignUp> = joi.object({
        firstName: joi.string().max(256).required(),
        lastName: joi.string().max(256).required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        phone: joi.string().max(50),
      })

      await UserSignupSchema.validateAsync(req.body, joiValidatorOptions)
      const existingUser = await db.query.users.findFirst({
        where(users, { eq }) {
          return eq(users.email, req.body.email)
        },
      })
      if (existingUser) {
        const error = new Error("A user with this email already exists")
        return this.sendErrorResponse(res, error, DUPLICATE_EMAIL, 400)
      }
      next()
    } catch (error: any) {
      return this.sendErrorResponse(
        res,
        error,
        badRequestError(error.message),
        400
      )
    }
  }
}

export default AppValidator

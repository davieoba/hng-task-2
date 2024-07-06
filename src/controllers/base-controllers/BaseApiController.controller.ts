import express, { Router } from "express"
import RequestUtils from "../../extensions/utils/request.utils"
import AppValidator from "../../middleware/app-validator.middleware"
import UserMiddleware from "../../middleware/user.middleware"
import BaseResponseHandler from "./BaseResponseHandler.controller"

abstract class BaseApiController extends BaseResponseHandler {
  router: Router
  userMiddleware: UserMiddleware
  requestUtils: RequestUtils
  appValidator: AppValidator

  constructor() {
    super()
    this.router = express.Router()
    this.appValidator = new AppValidator(this.router)
    this.userMiddleware = new UserMiddleware(this.router)
    this.requestUtils = new RequestUtils(this.router)
    this.initializeServices()
    this.initializeMiddleware()
    this.initializeRoutes()
  }

  protected abstract initializeServices(): void
  protected abstract initializeMiddleware(): void
  protected abstract initializeRoutes(): void
}

export default BaseApiController

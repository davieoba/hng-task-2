import BaseApiController from "./base-controllers/BaseApiController.controller"

class UserController extends BaseApiController {
  constructor() {
    super()
  }

  protected initializeServices(): void {
    throw new Error("Method not implemented.")
  }
  protected initializeMiddleware(): void {
    throw new Error("Method not implemented.")
  }
  protected initializeRoutes(): void {
    throw new Error("Method not implemented.")
  }
}

export default UserController

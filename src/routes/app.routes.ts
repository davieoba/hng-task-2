import { Express } from "express"
import Env from "../config/app.keys"
import OrganizationController from "../controllers/org.controller"
import UserController from "../controllers/user.controller"

class AppRoutes {
  app: Express
  userController: UserController
  organizationController: OrganizationController

  constructor(app: Express) {
    this.app = app
    this.userController = new UserController()
    this.organizationController = new OrganizationController()
  }

  initializeRoutes() {
    this.app.use(Env.API_PATH + "/users", this.userController.router)
    this.app.use(
      Env.API_PATH + "/organizations",
      this.organizationController.router
    )
  }
}

export default AppRoutes

/**
 *     // USER ROUTER
    this.app.use(Env.API_PATH, new UserController().router)

 */

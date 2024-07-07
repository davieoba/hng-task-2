import APP_CONSTANTS from "../config/app.constants"
import { BAD_REQUEST } from "../extensions/utils/error-response-message"
import BaseApiController from "./base-controllers/BaseApiController.controller"

class UserController extends BaseApiController {
  constructor() {
    super()
  }

  protected initializeServices(): void {}
  protected initializeMiddleware(): void {}
  protected initializeRoutes(): void {
    this.getMyRecord("/:id")
  }

  getMyRecord(path: string) {
    this.router.get(path)
    this.router.get(path, async (req, res) => {
      try {
        const id = req.params.id
        const user = this.requestUtils.getDataFromState(
          APP_CONSTANTS.USER_LABEL
        )
        if (id !== user.userId) {
          return this.sendErrorResponse(
            res,
            new Error("Authentication Failed"),
            BAD_REQUEST,
            401
          )
        }

        return this.sendSuccessResponse(res, "OK", user, 200)
      } catch (error: any) {
        this.sendErrorResponse(res, error, BAD_REQUEST, 400)
      }
    })
  }
}

export default UserController

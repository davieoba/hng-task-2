import express, { Express } from "express"
import Env from "./config/app.keys"
import AuthController from "./controllers/auth.controller"
import AuthMiddleware from "./middleware/auth.middleware"
import AppRoutes from "./routes/app.routes"

class App {
  public app: Express
  private appRoutes: AppRoutes
  private authMiddleware: AuthMiddleware

  constructor() {
    this.app = express()
    this.appRoutes = new AppRoutes(this.app)
    this.authMiddleware = new AuthMiddleware(this.app)
    this.plugInMiddlewares()
    this.plugInRoutes()
  }

  private plugInMiddlewares() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  private plugInRoutes() {
    this.app.get("/", (_req, res) => {
      res.status(200).send("<h1>Successful</h1>")
    })
    this.app.get(Env.API_PATH + "/health", (req, res) => {
      const response = "Server is healthy___  " + new Date().toUTCString()
      res.status(200).send(response)
    })

    this.app.use(Env.API_PATH, new AuthController().router)

    //  Load Authentication MiddleWare
    this.app.use(Env.API_PATH, this.authMiddleware.authGuard)

    // these are protected routes so I will add a middleware before it like an auth guard
    this.appRoutes.initializeRoutes()
    this.app.all("*", (_req, res) => {
      res.status(404).send("RESOURCE NOT FOUND")
    })
  }
}

export default new App().app

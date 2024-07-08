import jwt from "jsonwebtoken"
import UserService from "../user.service"

const JWT_SECRET = "hidden-leaf"

describe("User service", () => {
  let userService: UserService

  beforeAll(() => {
    userService = new UserService()
  })

  describe("login user", () => {
    it("should return a valid JWT token with a correct user details", async () => {
      const userId = "test0-id"
      const token = await userService.loginUser(userId)
      const decoded: any = jwt.verify(token, JWT_SECRET)
      expect(decoded.data).toBe(userId)

      const currentTime = Math.floor(Date.now() / 1000)
      const expiryTime = decoded.exp
      const expectedExpiryTime = currentTime + 3600

      expect(Math.abs(expectedExpiryTime - expiryTime)).toBeLessThan(5)
    })
  })
})

import { createAuthToken } from "../extensions/utils/auth.utils"

class UserService {
  constructor() {}
  async loginUser(userId: string): Promise<string> {
    try {
      // you can create user login session and save it to the database
      // you can also send the login session to the createAuthToken as part of the payload
      return createAuthToken(userId)
    } catch (error) {
      throw error
    }
  }
}

export default UserService

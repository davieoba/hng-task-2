import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Env from "../../config/app.keys"

const hashData = async (data: string, rounds = 12): Promise<string> => {
  const salt = await bcrypt.genSalt(rounds)
  return bcrypt.hash(data, salt)
}

const createAuthToken = async (userId: string) => {
  try {
    return jwt.sign({ data: userId }, Env.JWT_SECRET, {
      expiresIn: Env.JWT_EXPIRY,
    })
  } catch (error: any) {
    throw error
  }
}

const validateHashedData = async (
  value: string,
  hashedData: string
): Promise<boolean> => {
  return await bcrypt.compare(value, hashedData)
}

export { createAuthToken, hashData, validateHashedData }

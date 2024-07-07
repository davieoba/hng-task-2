import bcrypt from "bcryptjs"
import { Request } from "express"
import jwt from "jsonwebtoken"
import Env from "../../config/app.keys"
import { IJwtPayload } from "../types/response.type"

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

const getTokenFromRequest = (req: Request) => {
  let jwt = ""
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer") &&
    req.headers.authorization.split(" ").length > 1
  ) {
    jwt = req.headers.authorization.split(" ")[1]
  }

  return jwt
}

const verifyJwtToken = async (token: string): Promise<IJwtPayload> => {
  let decoded = null
  try {
    decoded = (await jwt.verify(token, Env.JWT_SECRET)) as IJwtPayload

    // if (!decoded) {
    //   throw new Error("Invalid Token")
    // }
    return decoded
  } catch (err) {
    throw err
  }
}

export {
  createAuthToken,
  getTokenFromRequest,
  hashData,
  validateHashedData,
  verifyJwtToken,
}

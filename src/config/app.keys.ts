import "dotenv/config"

export interface IEnv {
  PORT: number
  API_VERSION: string
  API_PATH: string
  ENVIRONMENT: string
  ALLOWED_ORIGINS: string[]
  POSTGRES_USER: string
  POSTGRES_DB: string
  POSTGRES_PASSWORD: string
  POSTGRES_URL: string
  POSTGRES_HOST: string
  JWT_SECRET: string
  JWT_EXPIRY: string
}

const Env: IEnv = {
  PORT: Number(process.env.PORT),
  API_PATH: "/api/" + process.env.API_VERSION,
  API_VERSION: process.env.API_VERSION as string,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(", ") as string[],
  ENVIRONMENT: process.env.ENVIRONMENT as string,
  POSTGRES_DB: process.env.POSTGRES_DB as string,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD as string,
  POSTGRES_HOST: process.env.POSTGRES_HOST as string,
  POSTGRES_URL: process.env.POSTGRES_URL as string,
  POSTGRES_USER: process.env.POSTGRES_USER as string,
  JWT_EXPIRY: process.env.JWT_EXPIRY as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
}

export default Env

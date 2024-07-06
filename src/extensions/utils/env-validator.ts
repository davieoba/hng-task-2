import joi from "joi"
import { ENVIRONMENTS } from "../../config/app.config"
import Env, { IEnv } from "../../config/app.keys"

function validateEnvironmentVariables() {
  try {
    const EnvSchema: joi.ObjectSchema<IEnv> = joi.object({
      ENVIRONMENT: joi
        .string()
        .valid(...Object.values(ENVIRONMENTS))
        .required(),
      PORT: joi.number().required(),
      ALLOWED_ORIGINS: joi.array().items(joi.string()).min(1).required(),
      API_VERSION: joi.string().required(),
      API_PATH: joi.string().required(),
      POSTGRES_DB: joi.string().required(),
      POSTGRES_HOST: joi.string().required(),
      POSTGRES_PASSWORD: joi.string().required(),
      POSTGRES_URL: joi.string().required(),
      POSTGRES_USER: joi.string().required(),
      JWT_EXPIRY: joi.string().required(),
      JWT_SECRET: joi.string().required(),
    })
    const response = EnvSchema.validate(Env)
    if (response.error)
      throw new Error(
        `Env validation error: ${response.error.details
          .map((x) => x.message)
          .join(", ")}`
      )
  } catch (error) {
    throw error
  }
}

export default validateEnvironmentVariables

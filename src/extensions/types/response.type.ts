interface IResponseMessage {
  response_code: number
  message: string
}

interface IJwtPayload {
  data: string
  iat: number
  exp: number
}

/**
 *   {
  data: 'c9ede30e-d0f1-49e6-8f9c-3149e74c5107',
  iat: 1720366229,
  exp: 1720798229
}
 */

export { IJwtPayload, IResponseMessage }

import {FastifyRequest, FastifyReply} from 'fastify'
import { z } from "zod"
import { InvalidCredentialsError } from '../services/errors/invalid-credentials-error'
import { makeAuthenticateService } from '../services/factories/make-authenticate-service'

export async function authenticate(request: FastifyRequest, reply:FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string(),
    password: z.string(),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateService = makeAuthenticateService()
    await authenticateService.execute({ email, password })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }

  return reply.status(200).send()
}
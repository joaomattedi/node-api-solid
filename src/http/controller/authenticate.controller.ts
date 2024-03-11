import {FastifyRequest, FastifyReply} from 'fastify'
import { z } from "zod"
import { PrimaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '../services/authenticate.service'
import { InvalidCredentialsError } from '../services/errors/invalid-credentials-error'

export async function authenticate(request: FastifyRequest, reply:FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string(),
    password: z.string(),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const usersRepository = new PrimaUsersRepository()
    const authenticateService = new AuthenticateService(usersRepository)
    await authenticateService.execute({ email, password })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }

  return reply.status(200).send()
}
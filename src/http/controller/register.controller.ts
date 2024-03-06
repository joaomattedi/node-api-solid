import {FastifyRequest, FastifyReply} from 'fastify'
import { z } from "zod"
import { RegisterUserService } from '../services/register.service'
import { PrimaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '../services/errors/user-already-exists-error'

export async function registerUser(request: FastifyRequest, reply:FastifyReply) {
  const registerUserBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  })

  const { name, email, password } = registerUserBodySchema.parse(request.body)

  try {
    const usersRepository = new PrimaUsersRepository()
    const registerUserService = new RegisterUserService(usersRepository)
    await registerUserService.execute({name,email,password})
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500).send() // TODO: fix
  }

  return reply.status(201).send()
}
import {FastifyRequest, FastifyReply} from 'fastify'
import { z } from "zod"
import { RegisterUserService } from '../services/register.service'
import { PrimaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

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
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
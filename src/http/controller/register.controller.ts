import {FastifyRequest, FastifyReply} from 'fastify'
import { z } from "zod"
import { UserAlreadyExistsError } from '../services/errors/user-already-exists-error'
import { makeRegisterService } from '../services/factories/make-register-service'

export async function registerUser(request: FastifyRequest, reply:FastifyReply) {
  const registerUserBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerUserBodySchema.parse(request.body)

  try {
    const registerUserService = makeRegisterService()
    await registerUserService.execute({name,email,password})
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }

  return reply.status(201).send()
}
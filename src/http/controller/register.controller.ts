import {FastifyRequest, FastifyReply} from 'fastify'
import { z } from "zod"
import { registerUserService } from '../services/register.service'

export async function registerUser(request: FastifyRequest, reply:FastifyReply) {
  const registerUserBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  })

  const { name, email, password } = registerUserBodySchema.parse(request.body)

  try {
    await registerUserService({name,email,password})
  } catch (err) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
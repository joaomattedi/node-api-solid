import fastify from "fastify"
import { appRoutes } from "./http/routes"
import { ZodError } from "zod"
import { env } from "./env"
import fastifyJwt from "@fastify/jwt"

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET
})

app.register(appRoutes)

app.setErrorHandler((err, _request, reply) => {
  if (err instanceof ZodError) {
    return reply
      .status(400)
      .send({
        message: 'Validation error.',
        issues: err.format()
      })
  }

  if (env.NODE_ENV !== "production") {
    console.error(err);    
  } else {
    // TODO: log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
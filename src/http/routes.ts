import { FastifyInstance } from "fastify";
import { registerUser } from "./controller/register.controller";
import { authenticate } from "./controller/authenticate.controller";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users',registerUser)

  app.post('/sessions',authenticate)
}
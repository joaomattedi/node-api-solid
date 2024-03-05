import { FastifyInstance } from "fastify";
import { registerUser } from "./controller/register.controller";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users',registerUser)
}
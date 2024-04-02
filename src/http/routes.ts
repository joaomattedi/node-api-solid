import { FastifyInstance } from "fastify";
import { registerUser } from "./controller/register.controller";
import { authenticate } from "./controller/authenticate.controller";
import { profile } from "./controller/profile.controller";
import { verifyJwt } from "./middlewares/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users',registerUser)
  app.post('/sessions',authenticate)
  
  /** Authenticated */
  app.get('/me', { onRequest: [ verifyJwt ] },profile)
}
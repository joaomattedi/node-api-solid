import { PrimaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { AuthenticateService } from "../authenticate.service"

export function makeRegisterService() {
  const usersRepository = new PrimaUsersRepository()
  const authenticateService = new AuthenticateService(usersRepository)

  return authenticateService
}
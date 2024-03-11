import { PrimaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { RegisterUserService } from "../register.service"

export function makeRegisterService() {
  const usersRepository = new PrimaUsersRepository()
  const registerUserService = new RegisterUserService(usersRepository)

  return registerUserService
}
import { PrimaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { GetUserProfileService } from "../get-user-profile.service"

export function makeGetUserProfileService() {
  const usersRepository = new PrimaUsersRepository()
  const useCase = new GetUserProfileService(usersRepository)

  return useCase
}
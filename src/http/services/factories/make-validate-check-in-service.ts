import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { ValidateCheckInsService } from "../validate-check-in.service"

export function makeValidateCheckInService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckInsService(checkInsRepository)

  return useCase
}
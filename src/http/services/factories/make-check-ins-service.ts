import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { CheckInsService } from "../check-ins.service"

export function makeCheckInsService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CheckInsService(checkInsRepository, gymsRepository)

  return useCase
}
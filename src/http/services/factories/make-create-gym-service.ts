import { CreateGymService } from "../create-gym.service"
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"

export function makeCreateGymService() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CreateGymService(gymsRepository)

  return useCase
}
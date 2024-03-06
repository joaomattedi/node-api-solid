import { prisma } from "@/lib/prisma"
import { PrimaUsersRepository } from "@/repositories/prima-users-repository"
import { hash } from "bcryptjs"

interface RegisterUserRequest {
  name: string,
  email: string,
  password: string
}

export async function registerUserService({name,email,password}: RegisterUserRequest){
  const password_hash = await hash(password, 6)

  const userExistent = await prisma.user.findUnique({
    where: {
      email,
    }
  })

  if (userExistent) {
    throw new Error('E-mail already exists.')
  }

  const prismaUserRepository = new PrimaUsersRepository()

  await prismaUserRepository.create({
    name,
    email,
    password_hash
  })
}
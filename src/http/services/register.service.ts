import { prisma } from "@/lib/prisma"
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

  await prisma.user.create({
    data:{
      name,
      email,
      password_hash
    }
  })
}
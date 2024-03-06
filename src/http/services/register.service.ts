import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

interface RegisterUserRequest {
  name: string,
  email: string,
  password: string
}

export class RegisterUserService {
  constructor(
    private usersRepository: any
  ) {}

  async execute({name,email,password}: RegisterUserRequest){
    const password_hash = await hash(password, 6)
  
    const userExistent = await prisma.user.findUnique({
      where: {
        email,
      }
    })
  
    if (userExistent) {
      throw new Error('E-mail already exists.')
    }
  
    await this.usersRepository.create({
      name,
      email,
      password_hash
    })
  }
}
import { prisma } from "@/lib/prisma"
import { UsersRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"

interface RegisterUserRequest {
  name: string,
  email: string,
  password: string
}

export class RegisterUserService {
  constructor(
    private usersRepository: UsersRepository
  ) {}

  async execute({name,email,password}: RegisterUserRequest){
    const password_hash = await hash(password, 6)
  
    const userExistent = await this.usersRepository.findByEmail(email)
  
    if (userExistent) {
      throw new UserAlreadyExistsError
    }
  
    await this.usersRepository.create({
      name,
      email,
      password_hash
    })
  }
}
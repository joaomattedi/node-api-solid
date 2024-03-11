import { expect, describe, it } from 'vitest'
import { RegisterUserService } from './register.service'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register service', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterUserService(usersRepository)

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterUserService(usersRepository)

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterUserService(usersRepository)

    const email = 'johndoe@email.com'

    await registerService.execute({
      name: 'John Doe',
      email,
      password: '123456'
    })

    await expect(() =>
      registerService.execute({
        name: 'John Doe',
        email,
        password: '123456'
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    
  })
})
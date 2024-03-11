import { expect, describe, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate.service'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate service', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository) // sut -> system under tests

    await usersRepository.create({
      name:'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('123456',6)
    })

    const { user } = await sut.execute({
      email: 'johndoe@email.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

    expect(() => sut.execute({
      email: 'johndoe@email.com',
      password: '123456'
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

    await usersRepository.create({
      name:'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('123456',6)
    })

    expect(() => sut.execute({
      email: 'johndoe@email.com',
      password: '654321'
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
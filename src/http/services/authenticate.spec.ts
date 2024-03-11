import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate.service'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService // sut -> system under tests


describe('Authenticate service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })

  it('should be able to authenticate', async () => {
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
    expect(() => sut.execute({
      email: 'johndoe@email.com',
      password: '123456'
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
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
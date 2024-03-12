import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInsService } from './check-ins.service'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInsService // sut -> system under tests


describe('Authenticate service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInsService(checkInsRepository)
  })

  it('should be able to check in', async () => {
      const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01'
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
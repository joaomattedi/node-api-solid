import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymService } from './create-gym.service'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymService

describe('Create gym service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'Code Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
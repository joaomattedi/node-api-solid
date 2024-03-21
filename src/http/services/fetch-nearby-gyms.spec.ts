import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsService } from './fetch-nearby-gyms.service'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService

describe('Fetch Nearby Gyms service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsService(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -26.4863744,
      longitude: -49.102848
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -26.3027887,
      longitude: -48.8493083
    })

    const { gyms } = await sut.execute({
      userLatitude: -26.4863744,
      userLongitude: -49.102848
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' })
    ])
  })
})
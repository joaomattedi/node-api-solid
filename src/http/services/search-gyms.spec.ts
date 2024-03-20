import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsService } from './search-gyms.service'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsService

describe('Search Gyms service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsService(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'JS gym',
      latitude: 0,
      longitude: 0
    })

    await gymsRepository.create({
      title: 'coding gym',
      latitude: 0,
      longitude: 0
    })

    const { gyms } = await sut.execute({
      query: 'JS',
      page: 1
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JS gym' })
    ])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Java Gym ${i}`,
        latitude: 0,
        longitude: 0
      })
    }

    const { gyms } = await sut.execute({
      page: 2,
      query: 'Java'
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Java Gym 21' }),
      expect.objectContaining({ title: 'Java Gym 22' })
    ])
  })
})
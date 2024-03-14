import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInsService } from './check-ins.service'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInsService // sut -> system under tests


describe('Check Ins service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInsService(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01'
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2024,2,13,11,0,0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01'
    })

    await expect(() => sut.execute({
      userId: 'user-01',
      gymId: 'gym-01'
    })).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024,2,13,11,0,0))
    
    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01'
    })

    vi.setSystemTime(new Date(2024,2,14,11,0,0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01'
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
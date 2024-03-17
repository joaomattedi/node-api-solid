import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInsService } from './check-ins.service'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInsService // sut -> system under tests


describe('Check Ins service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInsService(checkInsRepository,gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JS Gym',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0)
    })
    
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 0,
      userLongitude: 0
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2024,2,13,11,0,0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 0,
      userLongitude: 0
    })

    await expect(() => sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 0,
      userLongitude: 0
    })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024,2,13,11,0,0))
    
    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 0,
      userLongitude: 0
    })

    vi.setSystemTime(new Date(2024,2,14,11,0,0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 0,
      userLongitude: 0
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'React Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-26.2275072),
      longitude: new Decimal(-49.5157248)
    })

    await expect(() => sut.execute({
      userId: 'user-01',
      gymId: 'gym-02',
      userLatitude: -26.2596093,
      userLongitude: -49.5259387
    })).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
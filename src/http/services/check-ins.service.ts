import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

interface CheckInServiceRequest {
  userId: string,
  gymId: string,
  userLatitude: number,
  userLongitude: number
}

interface CheckInServiceResponse {
  checkIn: CheckIn
}

export class CheckInsService {
  constructor(
    private checkInsRepository: CheckInsRepository, 
    private gymsRepository: GymsRepository
  ) {}

  async execute({ userId, gymId, userLatitude, userLongitude }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distanceBetweenUserAndGym = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distanceBetweenUserAndGym > MAX_DISTANCE_IN_KILOMETERS) {
      throw new Error('Generic')
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

    if (checkInOnSameDate) {
      throw new Error('teste')
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId
    })

    return {
      checkIn,
    }
  }
}
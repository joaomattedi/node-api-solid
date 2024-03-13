import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';

interface CheckInServiceRequest {
  userId: string,
  gymId: string
}

interface CheckInServiceResponse {
  checkIn: CheckIn
}

export class CheckInsService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ userId, gymId }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const checkInsFromUser = await this.checkInsRepository.findByUserId(userId);
    const today = new Date()
    const userHasAlreadyCheckedInToday = checkInsFromUser.some(checkIn => (
      checkIn.created_at.getDate() === today.getDate()
      && checkIn.created_at.getMonth() === today.getMonth()
      && checkIn.created_at.getFullYear() === today.getFullYear()
    ))

    if (userHasAlreadyCheckedInToday) {
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
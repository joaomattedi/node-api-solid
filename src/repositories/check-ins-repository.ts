import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
  findByUserId(userId: string): Promise<CheckIn[]>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}
import { UsersRepository } from '@/repositories/users-reposository';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { compare } from 'bcryptjs';
import { CheckIn, User } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface CheckInServiceRequest {
	userId: string;
	gymId: string;
	userLatitude: number;
	userLongitude: number;
}

interface CheckInServiceResponse {
	checkIn: CheckIn;
}

export class CheckInService {
	constructor(
		private checkInsRepository: CheckInsRepository,
		private gymsRepository: GymsRepository
	) {}

	async execute({ userId, gymId }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
		const gym = this.gymsRepository.findById(gymId)

		if (!gym) {
			throw new ResourceNotFoundError()
		}

		const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

		if (checkInOnSameDay) {
			throw new Error();
		}

		const checkIn = await this.checkInsRepository.create({
			user_id: userId,
			gym_id: gymId,
		});

		return { checkIn };
	}
}

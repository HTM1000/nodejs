import { describe, it, expect, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';
import { CheckInService } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInService;

describe('check-in service', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new CheckInService(checkInsRepository);
	});

	it('should be able to CheckIn', async () => {
		const { checkIn } = await sut.execute({
			gymId: 'gymid-1',
			userId: 'userid-1',
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});
});

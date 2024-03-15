import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CheckInService } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { afterEach } from 'node:test';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe('check-in service', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInService(checkInsRepository, gymsRepository);

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: 'treina muito',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to CheckIn', async () => {
		const { checkIn } = await sut.execute({
			gymId: 'gymid-1',
			userId: 'userid-1',
      userLatitude: 0,
      userLongitude: 0,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: 'gymid-1',
			userId: 'userid-1',
      userLatitude: 0,
      userLongitude: 0,
		});

		await expect(() =>
			sut.execute({
				gymId: 'gymid-1',
				userId: 'userid-1',
        userLatitude: 0,
        userLongitude: 0,
			})
		).rejects.toBeInstanceOf(Error);
	});

	it('should be able to check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: 'gymid-1',
			userId: 'userid-1',
      userLatitude: 0,
      userLongitude: 0,
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: 'gymid-1',
			userId: 'userid-1',
      userLatitude: 0,
      userLongitude: 0,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});
});

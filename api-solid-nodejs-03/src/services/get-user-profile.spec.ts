import { UserProfileService } from './get-user-profile';
import { describe, it, expect, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';

let usersRepository: InMemoryUsersRepository;
let sut: UserProfileService;

describe('user profile service', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new UserProfileService(usersRepository);
	});

	it('should be able to get user profile', async () => {
		const createdUser = await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password_hash: await hash('123456', 6),
		});

		const { user } = await sut.execute({
      userId: createdUser.id,
		});

		expect(user.name).toEqual('John Doe');
	});

	it('should not be able to UserProfile with wrong email', async () => {
		await expect(() =>
			sut.execute({
				userId: 'non-existing-id'
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { test, describe, it, expect, beforeEach } from 'vitest';
import { RegisterService } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let usersRepository: InMemoryUsersRepository
let registerService: RegisterService

describe('register service', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		registerService = new RegisterService(usersRepository);
	})

	it('should be able to register', async () => {
		const { user } = await registerService.execute({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it('should hash user password upon registration', async () => {
		const { user } = await registerService.execute({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it('should not be able to register with same email twice', async () => {
		const email = 'johndoe@gmail.com';

		await registerService.execute({
			name: 'John Doe',
			email,
			password: '123456',
		});

		await expect(() =>
			registerService.execute({
				name: 'John Doe',
				email,
				password: '123456',
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});

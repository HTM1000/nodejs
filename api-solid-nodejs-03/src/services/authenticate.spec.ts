import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { test, describe, it, expect, beforeEach } from 'vitest';
import { RegisterService } from './register';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateService } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('authenticate service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateService(usersRepository);
  })

	it('should be able to authenticate', async () => {
		await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password_hash: await hash('123456', 6),
		});

		const { user } = await sut.execute({
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it('should not be able to authenticate with wrong email', async () => {
		await expect(() =>
			sut.execute({
				email: 'johndoe@gmail.com',
				password: '123456',
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password_hash: await hash('123456', 6),
		});

		await expect(() =>
			sut.execute({
				email: 'johndoe@gmail.com',
				password: '1234567',
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});

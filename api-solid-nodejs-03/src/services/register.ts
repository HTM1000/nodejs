import { prisma } from '@/lib/prisma';
import { UsersRepository } from '@/repositories/users-reposository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { User } from '@prisma/client';

interface RegisterServiceRequest {
	name: string;
	email: string;
	password: string;
}

interface RegisterServiceResponse {
	user: User;
}

/* 
  SOLID
  D - Dependency Inversion Principle
*/

export class RegisterService {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		name,
		email,
		password,
	}: RegisterServiceRequest): Promise<RegisterServiceResponse> {
		const passwordHash = await hash(password, 6);

		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) {
			throw UserAlreadyExistsError;
		}

		const user = await this.usersRepository.create({
			name,
			email,
			password_hash: passwordHash,
		});

		return { user };
	}
}

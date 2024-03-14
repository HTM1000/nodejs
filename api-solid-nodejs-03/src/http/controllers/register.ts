import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import { RegisterService } from '@/services/register';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error';

export async function register(req: FastifyRequest, rep: FastifyReply) {
	const registerUserSchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
	});

	const { name, email, password } = registerUserSchema.parse(req.body);

	try {
		const usersRepository = new PrismaUsersRepository();
		const registerService = new RegisterService(usersRepository);

		await registerService.execute({ name, email, password });
	} catch (err) {
		if (err instanceof UserAlreadyExistsError) {
			return rep.status(409).send({
				message: err.message
			})
		}

		throw err
	}

	return rep.status(201).send('Usuário cadastrado com sucesso');
}

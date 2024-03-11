import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import crypto from 'node:crypto';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

export async function mealsRoutes(app: FastifyInstance) {
	app.get(
		'/:user_id',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req) => {
			const getUserParamSchema = z.object({
				user_id: z.string().uuid(),
			});
			const { user_id } = getUserParamSchema.parse(req.params);
			const { sessionId } = req.cookies;

			const users = await knex('meals')
				.where({
					session_id: sessionId,
					user_id: user_id,
				})
				.select();

			return { users };
		}
	);

	app.get(
		'/:user_id/:id',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req) => {
			const getMealParamSchema = z.object({
				user_id: z.string().uuid(),
				id: z.string().uuid(),
			});
			const { sessionId } = req.cookies;

			const { user_id, id } = getMealParamSchema.parse(req.params);

			const meal = await knex('meals')
				.where({
					id,
					user_id: user_id,
					session_id: sessionId,
				})
				.first();

			return { meal };
		}
	);

	app.post('/:user_id', async (req, rep) => {
		console.log('valor da data: ', req.body);

		const createMealBodySchema = z.object({
			name: z.string(),
			description: z.string(),
			diet: z.boolean(),
			meal_date_time: z.string(),
		});

		const getUserParamSchema = z.object({
			user_id: z.string().uuid(),
		});

		const { user_id } = getUserParamSchema.parse(req.params);

		try {
			const { name, description, diet, meal_date_time } = createMealBodySchema.parse(req.body);

			const { sessionId } = req.cookies;

			await knex('meals').insert({
				id: crypto.randomUUID(),
				name,
				description,
				diet,
				meal_date_time,
				user_id,
				session_id: sessionId,
			});

			return rep.status(201).send('Refeição criada com sucesso');
		} catch (error) {
			console.error('Erro ao processar a requisição:', error);
			return rep.status(400).send('Erro ao processar a requisição');
		}
	});

	app.put(
		'/:user_id/:id',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req, rep) => {
			const getMealParamSchema = z.object({
				user_id: z.string().uuid(),
				id: z.string().uuid(),
			});

			const getMealBodySchema = z.object({
				name: z.string().optional(),
				description: z.string().optional(),
				diet: z.boolean().optional(),
				mealDateTime: z.string().optional(),
			});

			const { sessionId } = req.cookies;

			const { user_id, id } = getMealParamSchema.parse(req.params);

			try {

			const { name, description, diet, mealDateTime } = getMealBodySchema.parse(req.body);

			const meal = await knex('meals')
				.where({
					id,
					user_id: user_id,
					session_id: sessionId,
				})
				.first();

			await knex('meals')
				.where({
					id,
					user_id: user_id,
					session_id: sessionId,
				})
				.update({
					name: name ? name : meal.name,
					description: description ? description : meal.description,
					diet: diet ? diet : meal.diet,
					meal_date_time: mealDateTime ? mealDateTime : meal.meal_date_time,
				});

			return rep.status(201).send('Refeição atualizada com sucesso');
			} catch (error) {
				console.error('Erro ao processar a requisição:', error);
				return rep.status(400).send('Erro ao processar a requisição');
			}
		}
	);

	app.delete(
		'/:user_id/:id',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req, rep) => {
			const getMealParamsSchema = z.object({
				user_id: z.string().uuid(),
				id: z.string().uuid(),
			});

			const { sessionId } = req.cookies;

			const { user_id, id } = getMealParamsSchema.parse(req.params);

			const meal = await knex('meals')
				.where({
					id,
					user_id: user_id,
					session_id: sessionId,
				})
				.first();

			await knex('meals').delete(meal);

			return rep.status(201).send('Refeição deletada com sucesso');
		}
	);
}

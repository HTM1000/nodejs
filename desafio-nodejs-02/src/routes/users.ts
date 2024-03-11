import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import crypto from 'node:crypto';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

export async function usersRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req, rep) => {
			const { sessionId } = req.cookies;

			if (!sessionId) {
				return rep.status(401).send({
					error: 'Unauthorized',
				});
			}

			const users = await knex('users').where('session_id', sessionId).select();

			return { users };
		}
	);

	app.get(
		'/metrics/:id',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req) => {
			const getMealParamSchema = z.object({
				id: z.string().uuid(),
			});

			const { id } = getMealParamSchema.parse(req.params);

			const { sessionId } = req.cookies;

			const numberUserMeals = await knex('meals')
				.where({
					user_id: id,
					session_id: sessionId,
				})
				.count({count: '*'});

			const numberMealsWithinDiet = await knex('meals')
				.where({
					user_id: id,
					session_id: sessionId,
					diet: true,
				})
				.count({count: '*'});

			const numberMealsOutsideDiet = await knex('meals')
				.where({
					user_id: id,
					session_id: sessionId,
					diet: false,
				})
				.count({count: '*'});

			const datesWithinDiet = await knex('meals')
				.distinct(knex.raw('DATE(meal_date_time) as meal_date'))
				.where({
					user_id: id,
					session_id: sessionId,
					diet: true,
				})
				.orderBy('meal_date_time', 'asc');

			let consectivesDays = 0;
			let days = 0;
			for (let i = 0; i < datesWithinDiet.length - 1; i++) {
				const currentDay = new Date(datesWithinDiet[i].meal_date);
				const followingDay = new Date(datesWithinDiet[i + 1].meal_date);
				const diffInTime = followingDay.getTime() - currentDay.getTime();
				const dayInMillesecond = 1000 * 60 * 60 * 24;

				if (diffInTime <= dayInMillesecond) {
					consectivesDays++;
				} else {
					if (consectivesDays > days) {
						days = consectivesDays;
					}
					consectivesDays = 0;
				}
			}

			if (consectivesDays > days) {
				days = consectivesDays;
			}

			return {
				numberUserMeals: numberUserMeals[0].count,
				numberMealsWithinDiet: numberMealsWithinDiet[0].count,
				numberMealsOutsideDiet: numberMealsOutsideDiet[0].count,
				consectivesDays: days,
			};
		}
	);

	app.post('/', async (req, rep) => {
		const createUserBodySchema = z.object({
			name: z.string(),
		});

		const { name } = createUserBodySchema.parse(req.body);

		let sessionId = req.cookies.sessionId;

		if (!sessionId) {
			sessionId = crypto.randomUUID();

			rep.cookie('sessionId', sessionId, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7,
			});
		}

		await knex('users').insert({
			id: crypto.randomUUID(),
			name,
			session_id: sessionId,
		});

		return rep.status(201).send();
	});
}

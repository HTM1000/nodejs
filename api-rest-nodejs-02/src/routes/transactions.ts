import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import crypto from 'node:crypto';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

// Cookies -> formas de manter contexto entre requisições

/*
  testes
  unitário: unidade da sua aplicação
  integração: comunicação entre duas ou mais unidades
  e2e - ponta a ponta: simulam um usuário na aplicação

  front-end: abre a pagina de login, digite o texto no campo com Id email...
  back-end: chamadas HTTP, websockets...

  piramide de teste: 
    - E2E (não dependem de nenhuma tecnologia, nao dependem de arquitetura)
    - teste E2E muito lento
    - base são os teste unitários
*/

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (req, rep) => {

  })

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

			const transactions = await knex('transactions').where('session_id', sessionId).select();

			return { transactions };
		}
	);

	app.get(
		'/:id',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req) => {
			const getTransactionParamSchema = z.object({
				id: z.string().uuid(),
			});
			const { sessionId } = req.cookies;

			const { id } = getTransactionParamSchema.parse(req.params);

			const transaction = await knex('transactions')
				.where({
          id,
          session_id: sessionId,
        })
				.first();

			return { transaction };
		}
	);

	app.get(
		'/summary',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req) => {
			const { sessionId } = req.cookies;

			const summary = await knex('transactions')
        .where('session_id', sessionId)
				.sum('amount', {
					as: 'amount',
				})
				.first();

			return { summary };
		}
	);

	app.post(
		'/',
		async (req, rep) => {
			const createTransactionBodySchema = z.object({
				title: z.string(),
				amount: z.number(),
				type: z.enum(['credit', 'debit']),
			});

			const { title, amount, type } = createTransactionBodySchema.parse(req.body);

			let sessionId = req.cookies.sessionId;

			if (!sessionId) {
				sessionId = crypto.randomUUID();

				rep.cookie('sessionId', sessionId, {
					path: '/',
					maxAge: 60 * 60 * 24 * 7, // 7 dias
				});
			}

			await knex('transactions').insert({
				id: crypto.randomUUID(),
				title,
				amount: type === 'credit' ? amount : amount * -1,
				session_id: sessionId,
			});

			return rep.status(201).send();
		}
	);
}

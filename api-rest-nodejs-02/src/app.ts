import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

app.register(cookie)
// GET, POST, PUT, PATCH, DELETE
app.register(transactionsRoutes, {
  prefix: 'transactions'
})
//ESlint
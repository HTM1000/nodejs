import fastify from 'fastify'
import { ZodError, z } from 'zod'
import { prisma } from './lib/prisma'
import { register } from './http/controllers/register'
import { appRoutes } from './http/routes'
import { env } from 'process'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((err, _, rep) => {
  if (err instanceof ZodError) {
    return rep.status(400).send({ message: 'Validation error.', issues: err.format()})
  }

  if (env.NODE_ENV !== 'production') {
    console.log(err)
  }

  return rep.status(500).send({ message: 'Internal Server Error' })
})
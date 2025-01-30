import fastify from 'fastify'

import { userRoutes } from '@/api/user/routes'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { env } from '@/config/env'
import { registerDecorators } from './utils/decorators'

export const app = fastify({ logger: true })

app.register(cors, {
  // origin: 'http://localhost:3000',
  origin: '*', // Allow all origins for development
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET_KEY,
})

registerDecorators(app)

app.register(userRoutes, {
  prefix: 'api/v1/users',
})

app.get('/healthcheck', (_req, res) => {
  res.send({ message: 'Success' })
})

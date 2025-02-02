import fastify from 'fastify'

import { userRoutes } from '@/api/user/routes'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { env } from '@/config/env'
import { registerDecorators } from './utils/decorators'
import { AppError } from './utils/errors'
import fastifyRateLimit from '@fastify/rate-limit'

export const app = fastify({ logger: true })

app.register(cors, {
  // origin: 'http://localhost:3000',
  origin: '*', // Allow all origins for development
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET_KEY,
})

app.register(fastifyRateLimit, {
  max: 5, // Maximum number of requests
  timeWindow: '1 minute', // Time window for rate limiting
})

registerDecorators(app)

app.setErrorHandler((error, request, reply) => {
  request.log.error(error)

  if (error instanceof AppError) {
    // Handle custom errors
    reply.code(error.statusCode).send({
      message: error.message,
      details: error.details,
    })
  } else {
    // Handle unexpected errors
    reply.code(500).send({
      message: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    })
  }
})

app.register(userRoutes, {
  prefix: 'api/v1/users',
})

app.get('/healthcheck', (_req, res) => {
  res.send({ message: 'Success' })
})

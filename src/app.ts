import fastify from 'fastify'

import { userRoutes } from '@/api/user/routes'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { env } from '@/config/env'

export const app = fastify({ logger: true })

app.register(cors, {
  // origin: 'http://localhost:3000',
  origin: '*', // Allow all origins for development
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET_KEY,
})

// Decorator to access user in requests
app.decorate('authenticate', async function (request: any, reply: any) {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.send(err)
  }
})

app.decorate('authorize', (roles: string[]) => {
  return async function (request: any, reply: any) {
    try {
      await request.jwtVerify()
      if (!roles.includes(request.user.role)) {
        return reply.code(403).send({ message: 'Forbidden' })
      }
    } catch (err) {
      reply.send(err)
    }
  }
})

app.register(userRoutes, {
  prefix: 'api/v1/users',
})

app.get('/healthcheck', (_req, res) => {
  res.send({ message: 'Success' })
})

import { app } from '@/app'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

// Decorator to access user in requests
export function registerDecorators(app: FastifyInstance) {
  app.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    }
  )

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
}

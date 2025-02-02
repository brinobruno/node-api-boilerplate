import { app } from '@/app'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { ForbiddenError, UnauthorizedError } from './errors'

// Decorator to access user in requests
export function registerDecorators(app: FastifyInstance) {
  app.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify()
      } catch (err) {
        throw new UnauthorizedError('Invalid or expired token')
      }
    }
  )

  app.decorate('authorize', (roles: string[]) => {
    return async function (request: any, reply: FastifyReply) {
      try {
        await request.jwtVerify()
        if (!roles.includes(request.user.role)) {
          throw new ForbiddenError(
            'You do not have permission to access this resource'
          )
        }
      } catch (err) {
        throw err // Propagate the error to the global error handler
      }
    }
  })
}

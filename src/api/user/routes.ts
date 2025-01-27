import { FastifyInstance } from 'fastify'

import { userController } from '@/api/user/controller'
import { User } from '@/api/user/entity'
import { isAuthorized } from '@/utils/authorization'

export async function userRoutes(app: FastifyInstance) {
  app.get('/:id', { preHandler: [app.authenticate] }, userController.getById)

  app.get(
    '/',
    { preHandler: [app.authenticate, app.authorize(['admin'])] },
    userController.getAll
  )

  app.post('/', userController.create)

  app.post('/login', userController.login)

  app.post('/logout', { preHandler: [app.authenticate] }, userController.logout)

  app.put('/:id', { preHandler: [app.authenticate] }, userController.updateById)

  app.delete(
    '/:id',
    { preHandler: [app.authenticate] },
    userController.deleteById
  )

  // Example authorization
  app.post(
    '/feedback',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { role } = request.user as User

      if (!isAuthorized(role, 'Feedback', 'CREATE')) {
        return reply.code(403).send({ message: 'Forbidden' })
      }

      // Proceed.
      reply.code(201).send({ message: 'User has permission' })
    }
  )
}

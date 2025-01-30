import { User } from '@/api/user/entity'
import { connectDB } from '@/config/typeorm'
import { findUserSchema } from './schema'

const Repo = connectDB.manager.getRepository(User)

// Middleware to fetch user by ID and attach to request
export const fetchUserById = async (request: any, reply: any) => {
  const { id } = findUserSchema.parse(request.params)

  const user = await Repo.findOne({ where: { id } })
  if (!user) {
    return reply.code(404).send({ message: 'User not found' })
  }

  request.user = user as User
}

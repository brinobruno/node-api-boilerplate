import { User } from '@/api/user/entity'
import { connectDB } from '@/config/typeorm'
import { findUserSchema } from './schema'
import type { Repository } from 'typeorm'
import { NotFoundError } from '@/utils/errors'

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

export async function findUserOrThrow(
  userRepository: Repository<User>,
  conditions: { email?: string; id?: string }
): Promise<User> {
  const user = await userRepository.findOne({ where: conditions })
  if (!user) {
    throw new NotFoundError('User not found')
  }
  return user
}

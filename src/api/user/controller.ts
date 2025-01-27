import { FastifyReply, FastifyRequest } from 'fastify'

import { User as UserEntity } from '@/api/user/entity'
import { createUserSchema, updateUserSchema } from '@/api/user/schema'
import { app } from '@/app'
import { connectDB } from '@/config/typeorm'
import { hashPassword, verifyPassword } from '@/utils/password'

const User = connectDB.manager.getRepository(UserEntity)

export const userController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const userInput = createUserSchema.parse(request.body)

    const existingUser = await User.findOne({
      where: { email: userInput.email },
    })

    if (existingUser) {
      return reply.code(400).send({ message: 'Email already in use' })
    }

    const hashedPassword = await hashPassword(userInput.password)

    // Create and save the user
    const user = User.create({
      ...userInput,
      password: hashedPassword,
      role: 'client', // API should not be able to create admin role user
    })

    await user.save()

    const token = app.jwt.sign({ id: user.id, role: user.role })

    return reply
      .code(201)
      .send({ message: 'User created successfully', user, token })
  },

  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as {
      email: string
      password: string
    }

    const user = await User.findOne({ where: { email } })

    if (!user) {
      return reply.code(401).send({ message: 'Invalid email or password' })
    }

    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return reply.code(401).send({ message: 'Invalid email or password' })
    }

    // Generate JWT
    const token = app.jwt.sign({ id: user.id, role: user.role })

    return reply.send({ token })
  },

  async logout(_request: FastifyRequest, reply: FastifyReply) {
    // Client-side should handle token removal; nothing specific is needed server-side.
    return reply.send({ message: 'Logged out successfully' })
  },

  async updateById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    const userInput = updateUserSchema.parse(request.body)

    const existingUser = await User.findOne({ where: { id } })

    if (!existingUser)
      return reply.code(404).send({ message: 'User not found' })

    const hashedPassword = await hashPassword(userInput.password)

    Object.assign(existingUser, { ...userInput, password: hashedPassword })

    User.save(existingUser)

    return reply
      .code(200)
      .send({ message: 'User updated successfully', user: existingUser })
  },

  async deleteById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }

    const user = await User.findOne({ where: { id } })

    if (!user) return reply.code(404).send({ message: 'User not found' })

    User.remove(user)

    return reply
      .code(200)
      .send({ message: 'User deleted successfully', id: user.id })
  },

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }

    const user = await User.findOne({ where: { id } })

    if (!user) {
      return reply.code(404).send({ message: 'User not found' })
    }

    return reply.code(200).send(user)
  },

  async getAll(_request: FastifyRequest, reply: FastifyReply) {
    const users = await User.find()

    return reply.code(200).send({ users })
  },
}

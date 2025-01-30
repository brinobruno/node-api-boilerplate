import { FastifyReply, FastifyRequest } from 'fastify'

import { User as UserEntity } from '@/api/user/entity'
import {
  createUserSchema,
  passwordResetBodySchema,
  passwordResetInstructionsSchema,
  passwordResetQuerySchema,
  updateUserSchema,
} from '@/api/user/schema'
import { app } from '@/app'
import { connectDB } from '@/config/typeorm'
import { hashPassword, verifyPassword } from '@/utils/password'
import {
  sendOnboardingEmail,
  sendPasswordResetInstructionsEmail,
} from '@/mail/mail'
import { env } from '@/config/env'

const User = connectDB.manager.getRepository(UserEntity)

// TODO: Add forgot password feature
// TODO: Add deactivated deleted account email feature
export const userController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = createUserSchema.parse(request.body)

    const existingUser = await User.findOne({
      where: { email: body.email },
    })

    if (existingUser) {
      return reply.code(400).send({ message: 'Email already in use' })
    }

    const hashedPassword = await hashPassword(body.password)

    // Create and save the user
    const user = User.create({
      ...body,
      password: hashedPassword,
      role: 'client', // API should not be able to create admin role user
    })

    await user.save()

    const { id, email, name, role } = user

    const token = app.jwt.sign(
      { id, role },
      {
        expiresIn: '30d',
      }
    )

    await sendOnboardingEmail({ email, name })

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
    const token = app.jwt.sign(
      { id: user.id, role: user.role },
      {
        expiresIn: '30d',
      }
    )

    return reply.send({ token })
  },

  async logout(_request: FastifyRequest, reply: FastifyReply) {
    // Client-side should handle token removal; nothing specific is needed server-side.
    return reply.send({ message: 'Logged out successfully' })
  },

  async passwordResetInstructions(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { email } = passwordResetInstructionsSchema.parse(request.body)

    try {
      const user = await User.findOne({
        where: { email: email },
      })

      if (!user) {
        return reply.code(404).send({ message: 'User not found by email' })
      }

      const token = await app.jwt.sign(
        { id: user.id, email: user.email },
        { expiresIn: '1h' }
      )

      const resetURL = `${env.BASE_URL}/resetpassword?id=${user.id}&token=${token}`

      await sendPasswordResetInstructionsEmail({
        email: user.email,
        name: user.name,
        resetUrl: resetURL,
      })

      return reply
        .code(200)
        .send({ message: 'Instructions sent successfully', user, token })
    } catch (error) {
      console.error('Error sending password reset instructions', error)
      return reply.code(500).send({
        message: 'Error sending password reset instructions',
        error,
      })
    }
  },

  async passwordReset(request: FastifyRequest, reply: FastifyReply) {
    const { id, token } = passwordResetQuerySchema.parse(request.query)
    const { password } = passwordResetBodySchema.parse(request.body)

    try {
      const user = await User.findOne({
        where: { id: id },
      })

      if (!user) {
        return reply.code(404).send({ message: 'User not found by email' })
      }

      const verify = app.jwt.verify(token)

      const hashedPassword = await hashPassword(password)

      Object.assign(user, { ...user, password: hashedPassword })

      User.save(user)

      return reply
        .code(200)
        .send({ message: 'Password updated successfully', user })
    } catch (error) {
      console.error('Error updating password', error)
      return reply.code(500).send({
        message: 'Error updating password',
        error,
      })
    }
  },

  async updateById(request: FastifyRequest, reply: FastifyReply) {
    const userInput = updateUserSchema.parse(request.body)

    const hashedPassword = await hashPassword(userInput.password)
    Object.assign(request.user, { ...userInput, password: hashedPassword })

    await User.save(request.user as UserEntity)

    return reply
      .code(200)
      .send({ message: 'User updated successfully', user: request.user })
  },

  async deleteById(request: FastifyRequest, reply: FastifyReply) {
    const { user } = request

    User.remove(user as UserEntity)

    return reply.code(200).send({ message: 'User deleted successfully' })
  },

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { user } = await request

    return reply.code(200).send(user)
  },

  async getAll(_request: FastifyRequest, reply: FastifyReply) {
    const users = await User.find()

    return reply.code(200).send({ users })
  },
}

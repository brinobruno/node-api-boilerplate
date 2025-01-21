import bcrypt from 'bcrypt'

import { faker } from '@faker-js/faker'

const hashedPassword = bcrypt.hash('adminpassword', 10)

export const generateUser = async () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  password: await hashedPassword,
})

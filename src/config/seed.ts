import bcrypt from 'bcrypt'

import { User as UserEntity } from '@/api/user/entity'
import { env } from '@/config/env'

import {
  closeDataSource,
  connectDB,
  initializeDataSource,
} from '@/config/typeorm'
;(async () => {
  const User = connectDB.manager.getRepository(UserEntity)

  await initializeDataSource()

  const adminEmail = env.ADMIN_USER_EMAIL
  const adminPassword = env.ADMIN_USER_PASSWORD

  const existingAdmin = await User.findOne({ where: { email: adminEmail } })
  if (existingAdmin) {
    console.log('Admin user already exists.')
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    const admin = User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    })
    await admin.save()
    console.log('Admin user created successfully.')
  }

  await closeDataSource()
})()

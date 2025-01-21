import { User } from '@/entities/user.entity'

import { generateUser } from './generate-mock-data'

export const mockUser = async () => {
  const userMockData = await generateUser()

  const userInstance = new User({
    ...userMockData,
  })

  return { userMockData, userInstance }
}

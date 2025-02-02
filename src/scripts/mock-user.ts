import { User } from '@/api/user/entity'

import { generateUser } from '@/scripts/generate-mock-data'

export const mockUser = async () => {
  const userMockData = await generateUser()

  const userInstance = new User({
    ...userMockData,
  })

  return { userMockData, userInstance }
}

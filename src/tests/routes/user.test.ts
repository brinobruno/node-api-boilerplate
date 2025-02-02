import supertest from 'supertest'
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from 'vitest'

import { app } from '@/app'
import {
  closeDataSource,
  initializeDataSource,
  truncateDatabase,
} from '@/config/typeorm'
import { User } from '@/api/user/entity'
import { generateUser } from '@/scripts/generate-mock-data'

const API_URL = '/api/v1/users'
const USER_EMAIL = 'client@example.com'
const USER_PASSWORD = 'password123'

describe('User', async () => {
  beforeAll(async () => {
    await app.ready()
    await initializeDataSource()
  })

  afterAll(async () => {
    await app.close()
    await closeDataSource()
  })

  beforeEach(async () => {
    await truncateDatabase()
  })

  afterEach(async () => {
    await truncateDatabase()
  })

  const userData = await generateUser()

  describe('User entity', async () => {
    it('should create a user', async () => {
      try {
        const user = new User({ ...userData })
        await user.save()

        expect(user).toBeDefined()
      } catch (error) {
        app.log.error(error)
      }
    })
  })

  describe('User entity', async () => {
    it('should delete a user', async () => {
      try {
        const user = new User({ ...userData })
        await user.save()
        await user.remove()

        expect(user).toBeUndefined()
      } catch (error) {
        app.log.error(error)
      }
    })
  })

  describe('User routes', async () => {
    it('should create a user through request', async () => {
      try {
        const response = await supertest(app.server).post(`${API_URL}/`).send({
          name: 'Client User',
          email: USER_EMAIL,
          password: USER_PASSWORD,
        })

        expect(response.status).toBe(201)
        expect(response.body.user).toBeDefined()
        expect(response.body.user.role).toBe('client')
        expect(response.body.user.password).not.toEqual(USER_PASSWORD)
      } catch (error) {
        app.log.error(error)
      }
    })

    it('should login as admin', async () => {
      try {
        await supertest(app.server).post(`${API_URL}/`).send({
          name: 'Client User',
          email: USER_EMAIL,
          password: USER_PASSWORD,
        })

        const response = await supertest(app.server)
          .post(`${API_URL}/login`)
          .send({ email: USER_EMAIL, password: USER_PASSWORD })

        console.log(response.body)

        expect(response.status).toBe(200)
        expect(response.body.token).toBeDefined()
      } catch (error) {
        app.log.error(error)
      }
    })

    it('should not allow list all users without admin role', async () => {
      try {
        await supertest(app.server).post(`${API_URL}/`).send({
          name: 'Client User',
          email: USER_EMAIL,
          password: USER_PASSWORD,
        })

        await supertest(app.server)
          .post(`${API_URL}/login`)
          .send({ email: USER_EMAIL, password: USER_PASSWORD })

        const response = await supertest(app.server).get(`${API_URL}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('Forbidden')
      } catch (error) {
        app.log.error(error)
      }
    })
  })
})

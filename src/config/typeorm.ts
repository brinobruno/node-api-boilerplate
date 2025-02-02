import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { User } from '@/api/user/entity'

import { env } from '@/config/env'

const connectDB = new DataSource({
  type: 'postgres',
  host: env.DATABASE_HOST, // For docker 'db' or the service id
  port: env.DATABASE_PORT,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  logging: false,
  synchronize: env.DATABASE_SYNCHRONIZE, // For development
  entities: [User],
  migrations: ['migrations/**/*{.ts, .js}'],
  extra: {
    ssl: false,
    max: 10,
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 5000,
  },
})

// Condition to avoid beforeEach/afterEach excess logging
const isNotTestEnv = env.NODE_ENV !== 'test'

const initializeDataSource = async () => {
  try {
    await connectDB.initialize()
    if (isNotTestEnv) console.log(`Data Source has been initialized`)
    await connectDB.runMigrations()
  } catch (err) {
    console.error(`Data Source initialization error`, err)
    console.log(connectDB.driver)
    process.exit(1)
  }
}

const closeDataSource = async () => {
  if (connectDB) {
    try {
      await connectDB.destroy()
      if (isNotTestEnv) console.log(`Data Source has been closed`)
    } catch (err) {
      console.error(`Error closing Data Source`, err)
      process.exit(1)
    }
  }
}

const truncateDatabase = async () => {
  const queryRunner = connectDB.createQueryRunner()
  await queryRunner.connect()

  const entities = connectDB.entityMetadatas
  for (const entity of entities) {
    const tableName = `"${entity.tableName}"`
    await queryRunner.query(`DELETE FROM ${tableName};`)
  }

  await queryRunner.release()
}

export { connectDB, initializeDataSource, closeDataSource, truncateDatabase }

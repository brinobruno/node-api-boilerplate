import 'reflect-metadata'
import { app } from '@/app'
import { initializeDataSource } from '@/config/typeorm'
import { env } from '@/env'

app.register(async () => await initializeDataSource())

app
  .listen({
    host: '0.0.0.0', // Listens on all IPv4 addresses / alt: 127.0.0.1
    port: env.PORT,
  })
  .then(address => {
    console.log(`HTTP Server running on ${address} @ ${env.NODE_ENV}`)
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

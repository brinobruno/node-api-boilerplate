import 'reflect-metadata'
import cluster from 'cluster'
import os from 'os'
import { app } from '@/app'
import { initializeDataSource } from '@/config/typeorm'
import { env } from '@/config/env'

const startServer = async () => {
  await initializeDataSource()

  app
    .listen({
      host: '0.0.0.0', // Listens on all IPv4 addresses / alt: 127.0.0.1
      port: env.PORT,
    })
    .then(address => {
      console.log(
        `Worker ${process.pid} started. Server running on ${address} @ ${env.NODE_ENV}`
      )
    })
    .catch(error => {
      console.error('Server failed to start:', error)
      process.exit(1)
    })
}

// Clustering logic
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`)

  // Fork workers based on the number of CPU cores
  const numCPUs = os.cpus().length
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  // Handle worker exit events
  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
    )
    console.log('Forking a new worker...')
    cluster.fork() // Replace the dead worker
  })
} else {
  // Workers will start the server
  startServer().catch(error => {
    console.error('Failed to start server:', error)
    process.exit(1)
  })
}

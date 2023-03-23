import fastify from 'fastify'
// import crypto from 'node:crypto'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const server = fastify()

server.register(transactionsRoutes)

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP sever Running!')
  })

import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const server = fastify()

server.register(cookie)

server.addHook('preHandler', async (request) => {
  console.log(`[${request.method}] ${request.url}]`)
})

server.register(transactionsRoutes, {
  prefix: 'transactions',
})

server.get('/ping', async () => {
  console.log({ pong: true })
})

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP sever Running!')
  })

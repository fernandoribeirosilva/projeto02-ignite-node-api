import fastify from 'fastify'
// import crypto from 'node:crypto'
import { knex } from './database'
import { env } from './env'

const server = fastify()

server.get('/ping', async (req, res) => {
  // const transaction = await knex('transactions')
  //   .insert({
  //     id: crypto.randomUUID(),
  //     title: 'Transação de teste',
  //     amount: 1000,
  //   })
  //   .returning('*')

  const transaction = await knex('transactions')
    .where('amount', 500)
    .select('*')

  return transaction
})

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP sever Running!')
  })

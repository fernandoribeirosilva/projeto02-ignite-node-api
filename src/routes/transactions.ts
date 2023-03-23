import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/ping', async () => {
    // const transaction = await knex('transactions')
    //   .insert({
    //     id: crypto.randomUUID(),
    //     title: 'Transação de teste',
    //     amount: 1000,
    //   })
    //   .returning('*')

    const transaction = await knex('transactions')
      .where('amount', 1000)
      .select('*')

    return transaction
  })
}

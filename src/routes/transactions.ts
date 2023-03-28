import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { string, z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-existes'

export async function transactionsRoutes(app: FastifyInstance) {
  // middleware só vai esta dentro deste contesto, ou seja só para estas rotas
  // app.addHook('preHandler', async (request) => {
  //   console.log(`[${request.method}] ${request.url}]`)
  // })

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, replay) => {
      const { sessionId } = request.cookies

      const transaction = await knex('transactions')
        .where('session_id', sessionId)
        .select('*')

      return {
        transaction,
      }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getTransactionParamsSchema = z.object({
        id: string().uuid(),
      })

      const { id } = getTransactionParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const transaction = await knex('transactions')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return {
        transaction,
      }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId
    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/', // só com a '/' que disser que todas as rotas vai ter aceso ao cookie, mas se tiver '/transaction' ai é só esta rota que vai ter aceso
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.code(201).send()
  })
}

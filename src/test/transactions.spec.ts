import { beforeAll, afterAll, describe, it, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'

import { app } from '../app'

// vai executar algum código antes que todos os testes executem
// esta função só vai executar apenas uma única vez, antes de todos os testes
// para antes de cada testes deve usar beforeEach
// para executar depois de cada testes afterEach
// para executar depois de todos os testes afterAll

describe('Transaction routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all') // apaga o banco
    execSync('npm run knex migrate:latest') // e cria o banco de novo
  })

  it('User can create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('Should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    ])
  })
})

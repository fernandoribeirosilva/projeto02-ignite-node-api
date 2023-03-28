import { beforeAll, afterAll, describe, it } from 'vitest'
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

  it('user can create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })
})

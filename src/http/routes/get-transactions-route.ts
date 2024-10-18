import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getTransactions } from '../../functions/get-transactions'


export const getTransactionsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/transactions', async () => {
    const transactions = await getTransactions()

    return transactions 
  })
}

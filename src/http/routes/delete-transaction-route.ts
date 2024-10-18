import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { DeleteTransaction } from '../../functions/delete-transaction'

export const deleTransactionRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/transactions',
    {
      schema: {
        body: z.object({
          transactionId: z.string(),
        }),
      },
    },
    async request => {
      const { transactionId } = request.body

      const result = await DeleteTransaction(transactionId)

      return result
    }
  )
}

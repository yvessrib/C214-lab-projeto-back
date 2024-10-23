import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { updateTransaction } from '../../functions/update-transaction'

export const updateTransactionRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/transactions',
    {
      schema: {
        body: z.object({
          transactionId: z.string(),
          title: z.string().optional(),
          description: z.string().optional(),
          value: z.string().optional(),
          installments: z.number().optional(),
          endsAt: z.date().optional(),
          type: z.string().optional(),
        }),
      },
    },
    async request => {
      const { transactionId, title, description, value, installments, endsAt, type } = request.body

      await updateTransaction(transactionId, { title, description, value: Number(value), installments, endsAt, type })
    }
  )
}

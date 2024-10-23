import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createTransaction } from '../../functions/create-transaction'
import { transactions } from '../../db/schema'

export const createTransactionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/transactions',
    {
      schema: {
        body: z.object({
          title: z.string(),
          description: z.string(),
          value: z.number(),
          installments: z.number(),
          endsAt: z.string(),
          type: z.enum(['outcome', 'income']),
        }),
      },
    },
    async (request, reply) => {
      const { title, description, value, installments, endsAt, type} = request.body

      const transaction = await createTransaction({
        title,
        description,
        value,
        installments,
        endsAt: new Date(endsAt),
        type,
        createdAt: new Date()
      })

      return transaction
    }
  )
}

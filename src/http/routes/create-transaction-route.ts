import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createTransaction } from '../../functions/create-transaction'
import { transactions } from '../../db/schema'
import { updateProjectionTrigger } from '../../functions/update-projection-trigger'

export const createTransactionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/transactions',
    {
      schema: {
        body: z.object({
          title: z.string(),
          description: z.string(),
          value: z.string(),
          installments: z.number(),
          endsAt: z.string(),
          type: z.enum(['outcome', 'income']),
        }),
      },
    },
    async (request, reply) => {
      const { title, description, value, installments, endsAt, type} = request.body

      const createdAt = new Date()

      const transaction = await createTransaction({
        title,
        description,
        value: Number(value),
        installments,
        endsAt: new Date(endsAt),
        type,
        createdAt
      })

      const transactionYear = createdAt.getFullYear()
      const transactionMonth = createdAt.getMonth() + 1

      await updateProjectionTrigger(transactionYear, transactionMonth)

      return reply.status(200).send({ transaction })
    }
  )
}

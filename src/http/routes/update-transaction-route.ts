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
          value: z.number().optional(),
          installments: z.number().optional(),
          endsAt: z.string().optional(),
          type: z.string().optional(),
          createdAt: z.string().optional()
        }),
      },
    },
    async request => {
      const { transactionId, title, description, value, installments, endsAt, type, createdAt} = request.body

      let endsAtFormatted: Date | undefined
      let createdAtFormatted: Date | undefined

      if (endsAt !== undefined) {endsAtFormatted = new Date(endsAt)}
      if (createdAt !== undefined){createdAtFormatted = new Date(createdAt)}

      await updateTransaction(transactionId, { 
        title, 
        description, 
        value, 
        installments, 
        endsAt: endsAtFormatted, 
        type, 
        createdAt: createdAtFormatted,
      })
    }
  )
}

import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { deleteProjection } from '../../functions/delete-projection'

export const deleteProjectionRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/projections',
    {
      schema: {
        body: z.object({
          year: z.number(),
          month: z.number()
        }),
      },
    },
    async request => {
      const { year, month } = request.body

      await deleteProjection(year, month)
    }
  )
}

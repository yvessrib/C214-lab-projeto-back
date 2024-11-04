import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { updateProjection } from '../../functions/update-projection'

export const updateProjectionRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/projections',
    {
      schema: {
        body: z.object({
          year: z.number(),
          month: z.number(),
          expectedIncome: z.number()
        }),
      },
    },
    async request => {
      const { year, month, expectedIncome } = request.body

      await updateProjection({ year, month, expectedIncome })
    }
  )
}

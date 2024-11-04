import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createProjection } from '../../functions/create-projection'

export const createProjectionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/projections',
    {
      schema: {
        body: z.object({
          year: z.number(),
          month: z.number(),
          expectedIncome: z.number(),
        }),
      },
    },
    async (request, reply) => {
      const { year, month, expectedIncome } = request.body

      const projection = await createProjection({
        year,
        month,
        expectedIncome
      })

      return reply.status(200).send({ projection })
    }
  )
}

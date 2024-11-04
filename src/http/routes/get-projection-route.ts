import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getProjections } from '../../functions/get-projection'
import { z } from 'zod';

export const getProjectionsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/projections',
    {
      schema: {
        querystring: z.object({
          grouping: z.enum(['quarterly', 'yearly']),
          month: z.string().optional(),
          year: z.string().optional(),
        }),
      },
    },
    async (request) => {
      const { grouping, year, month } = request.query;

      const currentYear = year ? Number.parseInt(year) : new Date().getFullYear()
      const currentMonth = month ? Number.parseInt(month) : (new Date().getMonth() + 1)

      const projections = getProjections(grouping, currentMonth, currentYear)

      return projections;
    }
  );
}

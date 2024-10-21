import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getIncomeOutcomeOfTheYear } from '../../functions/get-income-outcome'
import { z } from 'zod';

export const getIncomeOutcomeOftheYearRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/transactionsSummary',
    {
      schema: {
        querystring: z.object({
          year: z.string().optional(), // Parâmetro year opcional
        }),
      },
    },
    async (request) => {
      const { year } = request.query;
  
      const currentYear = year ?? new Date().getFullYear().toString();;
  
      const incomeOutcome = await getIncomeOutcomeOfTheYear(currentYear);
  
      return incomeOutcome;
    }
  );
}

import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifyCors from '@fastify/cors'
import { createTransactionRoute } from './routes/create-transaction-route';
import { getTransactionsRoute } from './routes/get-transactions-route';
import { deleTransactionRoute } from './routes/delete-transaction-route';
import { updateTransactionRoute } from './routes/update-transaction-route';
import { getIncomeOutcomeOftheYearRoute } from './routes/get-income-outcome-route';
import { createProjectionRoute } from './routes/create-projection-route';
import { getProjectionsRoute } from './routes/get-projection-route';
import { updateProjectionRoute } from './routes/update-projection-route';
import { deleteProjectionRoute } from './routes/delete-projection-route';

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createTransactionRoute)
app.register(getTransactionsRoute)
app.register(deleTransactionRoute)
app.register(updateTransactionRoute)
app.register(getIncomeOutcomeOftheYearRoute)
app.register(createProjectionRoute)
app.register(getProjectionsRoute)
app.register(updateProjectionRoute)
app.register(deleteProjectionRoute)


app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
  console.log('HTTP server running')
})




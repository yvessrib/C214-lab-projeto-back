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

const port = process.env.PORT || 3333

app.listen({
  port: Number(port)
}).then(() => {
  console.log('HTTP server running')
})




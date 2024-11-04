import { eq } from "drizzle-orm";
import { db } from "../db";
import { transactions } from "../db/schema";
import { handleTransactionUpdate } from '../functions/handle-transaction-update'

interface UpdateTransactionRequest {
  title?: string;
  description?: string;
  value?: number;
  installments?: number;
  endsAt?: Date;
  type?: string;
  createdAt?: Date;
}

export async function updateTransaction(
  transactionId: string,
  {
    title, 
    description, 
    value, 
    installments, 
    endsAt, 
    type,
    createdAt
  }: UpdateTransactionRequest) {

  const oldTransactionArray = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, transactionId))

  const oldTransaction = oldTransactionArray[0]  

  if (!oldTransaction) {
    throw new Error(`Transaction with ID ${transactionId} not found`);
  }

  const updateData: Partial<UpdateTransactionRequest> = {}
  if (title !== undefined){updateData.title = title}
  if (description !== undefined){updateData.description = description}
  if (value !== undefined){updateData.value = value}
  if (installments !== undefined){updateData.installments = installments}
  if (endsAt !== undefined){updateData.endsAt = endsAt}
  if (type !== undefined){updateData.type = type}
  if (createdAt!== undefined){updateData.createdAt = createdAt}

  await db.update(transactions)
    .set(updateData)
    .where(eq(transactions.id, transactionId))

    const newTransaction = {
      ...oldTransaction,
      ...updateData,
    }

    await handleTransactionUpdate(oldTransaction, newTransaction)

  return 'Transaction updated successfully'
}
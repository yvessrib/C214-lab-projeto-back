import { eq } from "drizzle-orm";
import { db } from "../db";
import { transactions } from "../db/schema";

interface UpdateTransactionRequest {
  title?: string;
  description?: string;
  value?: string;
  installments?: number;
  endsAt?: Date;
  type?: string;
}

export async function updateTransaction(
  transactionId: string,
  {
    title, 
    description, 
    value, 
    installments, 
    endsAt, 
    type
  }: UpdateTransactionRequest) {

  const updateData: Partial<UpdateTransactionRequest> = {}

  if (title !== undefined) updateData.title = title
  if (description !== undefined) updateData.description = description
  if (value !== undefined) updateData.value = value
  if (installments !== undefined) updateData.installments = installments
  if (endsAt !== undefined) updateData.endsAt = endsAt
  if (type !== undefined) updateData.type = type

  const result = await db.update(transactions)
    .set(updateData)
    .where(eq(transactions.id, transactionId))

  return 'Transaction updated successfully'
}
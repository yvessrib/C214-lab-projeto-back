import { db } from "../db";
import { transactions } from "../db/schema";

interface CreateTransactionRequest {
  title: string;
  description: string;
  value: string;
  installments: number;
  endsAt: Date;
  type: string;
}

export async function createTransaction(
  {
    title, 
    description, 
    value, 
    installments, 
    endsAt, 
    type
  }: CreateTransactionRequest) {
  const result = await db.insert(transactions).values({
    title,
    description,
    value,
    installments,
    endsAt,
    type,
  })

  const transaction = result[0]

  return {
    transaction,
  }
}
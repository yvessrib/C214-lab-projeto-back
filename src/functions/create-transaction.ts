import { db } from "../db";
import { transactions } from "../db/schema";

interface CreateTransactionRequest {
  title: string;
  description: string;
  value: number;
  installments: number;
  endsAt: Date;
  type: string;
  createdAt: Date;
}

export async function createTransaction(
  {
    title, 
    description, 
    value, 
    installments, 
    endsAt, 
    type,
    createdAt
  }: CreateTransactionRequest) {

  const result = await db.insert(transactions).values({
    title,
    description,
    value,
    installments,
    endsAt,
    type,
    createdAt
  })

  const transaction = result[0]

  return {
    transaction,
  }
}
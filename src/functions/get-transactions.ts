import { db } from "../db";
import { transactions } from "../db/schema";

export async function getTransactions(){
 
  const transactionsComplete = await db.select().from(transactions)

  return transactionsComplete;
}
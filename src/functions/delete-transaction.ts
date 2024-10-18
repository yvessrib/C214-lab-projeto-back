import { eq } from "drizzle-orm";
import { transactions } from "../db/schema";
import { db } from "../db";

export async function DeleteTransaction (transactionId : string) {
  
  await db
    .delete(transactions)
    .where(eq(transactions.id, transactionId))

  return {
    message: "Transaction deleted successfully"
  }
}
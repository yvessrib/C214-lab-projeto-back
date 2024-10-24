import { eq, and, sql } from "drizzle-orm";
import { projections, transactions } from "../db/schema";
import { db } from "../db";

export async function DeleteTransaction (transactionId : string) {
  
  const transactionArray = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, transactionId))

  
  const transaction = transactionArray[0]

  if (!transaction) {
    throw new Error('Transaction not found')
  }

  const year = transaction.createdAt.getFullYear()
  const month = transaction.createdAt.getMonth() + 1

  await db
    .delete(transactions)
    .where(eq(transactions.id, transactionId))

  const projectionArray = await db
    .select()
    .from(projections)
    .where(
      and(
        eq(projections.year, year),
        eq(projections.month, month)
      )
    )

  const projection = projectionArray[0]

  if(projection) {

    const actual_income = await db
    .select({ 
      value: sql<number> /*sql*/ `SUM(${transactions.value})`
    })
    .from(transactions)
    .where(
      and(
        sql /*sql*/ `${transactions.type} = 'income'`,
        sql /*sql*/ `EXTRACT(YEAR FROM ${transactions.createdAt}::timestamp) = ${year}`,
        sql /*sql*/ `EXTRACT(MONTH FROM ${transactions.createdAt}::timestamp) = ${month}`
      )
    );

    const actualIncome = actual_income[0]?.value || 0;

    const actual_outcome = await db
      .select({
        value: sql<number> /*sql*/ `SUM(${transactions.value})`
      })
      .from(transactions)
      .where(
        and(
          sql /*sql*/ `${transactions.type} = 'outcome'`,
          sql /*sql*/ `EXTRACT(YEAR FROM ${transactions.createdAt}::timestamp) = ${year}`,
          sql /*sql*/ `EXTRACT(MONTH FROM ${transactions.createdAt}::timestamp) = ${month}`
        )
      );

    const actualOutcome = actual_outcome[0]?.value || 0;

    await db
      .update(projections)
      .set({
        actualIncome,
        actualOutcome
      })
      .where(
        and(
          eq(projections.year, year),
          eq(projections.month, month)
        ))
  }
  
  return {
    message: "Transaction deleted successfully"
  }
}
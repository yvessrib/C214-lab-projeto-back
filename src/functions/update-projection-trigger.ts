import { and, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { projections, transactions } from "../db/schema";

export async function updateProjectionForMonth(year: number, month: number){
 
  const transactionsOfMonth = await db
    .select()
    .from(transactions)
    .where(
      and(
        sql /*sql*/ `EXTRACT(YEAR FROM ${transactions.createdAt}::timestamp) = ${year}`,
      sql /*sql*/ `EXTRACT(MONTH FROM ${transactions.createdAt}::timestamp) = ${month}`
      )
    )

  const actualIncome = transactionsOfMonth
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.value, 0)

  const actualOutcome = transactionsOfMonth
    .filter(t => t.type === 'outcome')
    .reduce((sum, t) => sum + t.value, 0)


  await db
    .update(projections)
    .set({
      actualIncome: actualIncome,
      actualOutcome: actualOutcome,
    })
    .where(
      and(eq(projections.year, year), eq(projections.month, month))
    )

  // const actual_income = await db
  // .select({
  //   value: sql<number> /*sql*/ `SUM(${transactions.value})`
  // })
  // .from(transactions)
  // .where(
  //   and(
  //     sql /*sql*/ `${transactions.type} = 'income'`,
  //     sql /*sql*/ `EXTRACT(YEAR FROM ${transactions.createdAt}::timestamp) = ${year}`,
  //     sql /*sql*/ `EXTRACT(MONTH FROM ${transactions.createdAt}::timestamp) = ${month}`
  //   )
  // );

  // const actual_outcome = await db
  //   .select({
  //     value: sql<number> /*sql*/ `SUM(${transactions.value})`
  //   })
  //   .from(transactions)
  //   .where(
  //     and(
  //       sql /*sql*/ `${transactions.type} = 'outcome'`,
  //       sql /*sql*/ `EXTRACT(YEAR FROM ${transactions.createdAt}::timestamp) = ${year}`,
  //       sql /*sql*/ `EXTRACT(MONTH FROM ${transactions.createdAt}::timestamp) = ${month}`
  //     )
  //   );
    
  // await db
  //   .update(projections)
  //   .set({
  //     actualIncome: actual_income[0]?.value || 0,
  //     actualOutcome: actual_outcome[0]?.value || 0,
  //   })
  //   .where(
  //     and(eq(projections.year, year), eq(projections.month, month))
  //   )
}
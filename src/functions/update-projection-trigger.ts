import { and, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { projections, transactions } from "../db/schema";

export async function updateProjectionTrigger(year: number, month: number){
 
  const actual_income = await db
  .select({
    value: sql<number> /*sql*/ `SUM(${transactions.value}::numeric)`
  })
  .from(transactions)
  .where(
    and(
      sql /*sql*/ `${transactions.type} = 'income'`,
      sql /*sql*/ `EXTRACT(YEAR FROM ${transactions.createdAt}) = ${year}`,
      sql /*sql*/ `EXTRACT(MONTH FROM ${transactions.createdAt}) = ${month}`
    )
  );

  const actual_outcome = await db
    .select({
      value: sql<number> /*sql*/ `SUM(${transactions.value}::numeric)`
    })
    .from(transactions)
    .where(
      and(
        sql /*sql*/ `${transactions.type} = 'outcome'`,
        sql /*sql*/ `EXTRACT(YEAR FROM ${transactions.createdAt}) = ${year}`,
        sql /*sql*/ `EXTRACT(MONTH FROM ${transactions.createdAt}) = ${month}`
      )
    );
    
  await db
    .update(projections)
    .set({
      actualIncome: actual_income[0]?.value || 0,
      actualOutcome: actual_outcome[0]?.value || 0,
    })
    .where(
      and(eq(projections.year, year),  eq(projections.year, year))
    )


}
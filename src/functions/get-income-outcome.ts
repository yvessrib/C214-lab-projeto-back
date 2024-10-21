import { and, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { transactions } from "../db/schema";

export async function getIncomeOutcomeOfTheYear(currentYear: string){
  const income = await db.select({
    totalIncome: sql /*sql*/ `SUM(${transactions.value}::numeric)`
  })
  .from(transactions)
  .where(
    and(
      eq(transactions.type, 'income'),
      sql /*sql*/ 
      `EXTRACT(YEAR FROM ${transactions.createdAt}) = ${currentYear}`
    )
  );

  const outcome = await db.select({
    totalOutcome: sql /*sql*/ `SUM(${transactions.value}::numeric)`
  })
  .from(transactions)
  .where(
    and(
      eq(transactions.type, 'outcome'),
      sql /*sql*/ 
      `EXTRACT(YEAR FROM ${transactions.createdAt}) = ${currentYear}`
    )
  );

  return {
    totalIncome: income.length > 0 && income[0]?.totalIncome !== null ? income[0].totalIncome : 0,
    totalOutcome: outcome.length > 0 && outcome[0]?.totalOutcome !== null ? outcome[0].totalOutcome : 0
  };
}
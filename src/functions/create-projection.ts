import { and, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { projections, transactions } from "../db/schema";

interface CreateProjectionRequest {
  year: number;
  month: number;
  expectedIncome: number;
}

export async function createProjection(
  {
    year, 
    month, 
    expectedIncome, 
  }: CreateProjectionRequest) {

  const existingProjection = await db
    .select()
    .from(projections)
    .where( and( eq(projections.year, year), eq(projections.month, month) ))

  if (existingProjection.length > 0) {
    throw new Error('Já existe uma projeção para esse mês e ano');
  }

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

  const result = await db.insert(projections).values({
    year,
    month,
    expectedIncome: expectedIncome,
    actualIncome: actualIncome,
    actualOutcome: actualOutcome,
    createdAt: new Date(),
  })

  return {
    result,
  };


  
}
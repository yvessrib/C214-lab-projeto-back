import { and, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { projections } from "../db/schema";

function getMonthName(month: number) {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  return months[month - 1]
}

export async function getProjections(grouping: 'quarterly' | 'yearly', currentMonth: number, currentYear: number){

  if (grouping === 'quarterly') {
    const currentQuarter  = Math.ceil(currentMonth / 3)
    const startMonth = (currentQuarter - 1) * 3 + 1
    const endMonth = currentQuarter * 3

    const result = await db
      .select({
        month: projections.month,
        expectedIncome: sql<number>/*sql*/`SUM(${projections.expectedIncome}::numeric)`,
        actualIncome: sql<number>/*sql*/`SUM(${projections.actualIncome}::numeric)`,
        actualOutcome: sql<number>/*sql*/`SUM(${projections.actualOutcome}::numeric)`,
      })
      .from(projections)
      .where(
        and(
          eq(projections.year, currentYear),
          sql/*sql*/`${projections.month} BETWEEN ${startMonth} AND ${endMonth}`,	
        )
      )
      .groupBy(projections.month)
      .orderBy(projections.month)

    const monthsInQuarter = [startMonth, startMonth + 1, endMonth]

    const formattedResult = monthsInQuarter.map(month => {
      const projection = result.find(p => p.month === month);
      return {
        month: getMonthName(month),
        expectedIncome: Number(projection?.expectedIncome) || 0,
        actualIncome: Number(projection?.actualIncome) || 0,
        actualOutcome: Number(projection?.actualOutcome) || 0,
      };
    });

    return {
      months: formattedResult,
      summary: {
        actualIncome: formattedResult.reduce((acc, p) => acc + p.actualIncome, 0),
        missingIncome: formattedResult.reduce((acc, p) => acc + p.expectedIncome - p.actualIncome, 0),
        actualOucome: formattedResult.reduce((acc, p) => acc + p.actualOutcome, 0),
      }
    }
  }
  
  if (grouping === 'yearly') {

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const result = await db
      .select({
        month: projections.month,
        expectedIncome: sql<number>/*sql*/`SUM(${projections.expectedIncome}::numeric)`,
        actualIncome: sql<number>/*sql*/`SUM(${projections.actualIncome}::numeric)`,
        actualOutcome: sql<number>/*sql*/`SUM(${projections.actualOutcome}::numeric)`,
      })
      .from(projections)
      .where(
        eq(projections.year, currentYear),
      )
      .groupBy(projections.month)
      .orderBy(projections.month)

    const formattedResult = months.map(month => {
      const projection = result.find(p => p.month === month);
      return {
        month: getMonthName(month),  // Nome do mês (Janeiro, Fevereiro, etc.)
        expectedIncome: Number(projection?.expectedIncome) || 0, // Projeção do mês ou 0 se não existir
        actualIncome: Number(projection?.actualIncome) || 0,
        actualOutcome: Number(projection?.actualOutcome) || 0,
      };
    });

    return {
      months: formattedResult,
      summary: {
        actualIncome: formattedResult.reduce((acc, p) => acc + p.actualIncome, 0),
        missingIncome: formattedResult.reduce((acc, p) => acc + p.expectedIncome - p.actualIncome, 0),
        actualOutcome: formattedResult.reduce((acc, p) => acc + p.actualOutcome, 0),
      }
    }
  }

  throw new Error('Opção de agrupamento inválida');
}
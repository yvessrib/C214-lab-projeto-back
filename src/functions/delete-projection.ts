import { eq, and, sql } from "drizzle-orm";
import { projections, transactions } from "../db/schema";
import { db } from "../db";

export async function deleteProjection(year : number, month : number) {

  const existingProjection = await db
    .select({
      projectionId: projections.id   
    })
    .from(projections)
    .where(
      and(
        eq(projections.year, year),
        eq(projections.month, month)
      )
    )

  const projection = existingProjection[0];
  
  const projectionArray = await db
    .select()
    .from(projections)
    .where(eq(projections.id, projection.projectionId))
  
  const projeciton = projectionArray[0]

  if (projeciton === undefined) {
    throw new Error('Projection not found')
  }

  await db
    .delete(projections)
    .where(eq(projections.id, projection.projectionId))
  
  return {
    message: "Projection deleted successfully"
  }
}
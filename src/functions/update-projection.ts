import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { projections } from "../db/schema";

interface UpdateProjectionRequest {
  year: number;
  month: number;
  expectedIncome: number;
}

export async function updateProjection(
  {
    year, 
    month, 
    expectedIncome
  }: UpdateProjectionRequest) {

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

  if (projection === undefined) {
    throw new Error(`Projection for year ${year} and month ${month} not found`);
  }

  await db.update(projections)
    .set({expectedIncome})
    .where(
      eq(projections.id, projection.projectionId)
    )

  return 'Projection updated successfully'
}
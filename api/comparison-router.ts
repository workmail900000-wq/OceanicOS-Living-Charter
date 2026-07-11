import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { comparisonSessions } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const comparisonRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;
    const sessions = await db
      .select()
      .from(comparisonSessions)
      .where(eq(comparisonSessions.userId, userId))
      .orderBy(desc(comparisonSessions.createdAt));
    return sessions;
  }),

  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        configIds: z.array(z.number()),
        testText: z.string().min(1),
        results: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;
      await (db as any).insert(comparisonSessions).values({
        userId: userId,
        name: input.name,
        configIds: input.configIds,
        testText: input.testText,
        results: input.results ?? {},
      });
      return { success: true };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;
      const existing = await db
        .select()
        .from(comparisonSessions)
        .where(eq(comparisonSessions.id, input.id))
        .limit(1);
      if (!existing[0] || existing[0].userId !== userId) {
        throw new Error("Unauthorized");
      }
      await db.delete(comparisonSessions).where(eq(comparisonSessions.id, input.id));
      return { success: true };
    }),
});

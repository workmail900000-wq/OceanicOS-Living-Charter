import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { tokenizerConfigs } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const tokenizerRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    const publicConfigs = await db
      .select()
      .from(tokenizerConfigs)
      .where(eq(tokenizerConfigs.isPublic, "public"))
      .orderBy(desc(tokenizerConfigs.createdAt));
    return { publicConfigs };
  }),

  listMine: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;
    const myConfigs = await db
      .select()
      .from(tokenizerConfigs)
      .where(eq(tokenizerConfigs.userId, userId))
      .orderBy(desc(tokenizerConfigs.createdAt));
    return { myConfigs };
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(tokenizerConfigs)
        .where(eq(tokenizerConfigs.id, input.id))
        .limit(1);
      return results[0] ?? null;
    }),

  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        vocabSize: z.number().int().min(256).max(65536),
        pattern: z.string().default(""),
        textSample: z.string().min(1),
        merges: z.array(
          z.object({
            pair: z.tuple([z.number(), z.number()]),
            newId: z.number(),
          })
        ),
        isPublic: z.enum(["private", "public"]).default("private"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;
      const result = await (db as any).insert(tokenizerConfigs).values({
        userId: userId,
        name: input.name,
        vocabSize: input.vocabSize,
        pattern: input.pattern,
        textSample: input.textSample,
        merges: input.merges,
        isPublic: input.isPublic,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        vocabSize: z.number().int().min(256).max(65536).optional(),
        textSample: z.string().min(1).optional(),
        merges: z
          .array(
            z.object({
              pair: z.tuple([z.number(), z.number()]),
              newId: z.number(),
            })
          )
          .optional(),
        isPublic: z.enum(["private", "public"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const existing = await db
        .select()
        .from(tokenizerConfigs)
        .where(eq(tokenizerConfigs.id, input.id))
        .limit(1);

      if (!existing[0] || existing[0].userId !== userId) {
        throw new Error("Unauthorized");
      }

      const { id, ...updates } = input;
      await db
        .update(tokenizerConfigs)
        .set(updates)
        .where(eq(tokenizerConfigs.id, id));

      return { success: true };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const existing = await db
        .select()
        .from(tokenizerConfigs)
        .where(eq(tokenizerConfigs.id, input.id))
        .limit(1);

      if (!existing[0] || existing[0].userId !== userId) {
        throw new Error("Unauthorized");
      }

      await db.delete(tokenizerConfigs).where(eq(tokenizerConfigs.id, input.id));
      return { success: true };
    }),
});

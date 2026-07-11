import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  json,
  int,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Tokenizer Configurations ─────────────────────────────────────

export const tokenizerConfigs = mysqlTable("tokenizer_configs", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  name: varchar("name", { length: 255 }).notNull(),
  vocabSize: int("vocabSize").notNull(),
  pattern: varchar("pattern", { length: 500 }).default(""),
  textSample: text("textSample").notNull(),
  merges: json("merges").$type<Array<{ pair: [number, number]; newId: number }>>().notNull(),
  isPublic: mysqlEnum("isPublic", ["private", "public"]).default("private").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type TokenizerConfig = typeof tokenizerConfigs.$inferSelect;
export type InsertTokenizerConfig = typeof tokenizerConfigs.$inferInsert;

// ─── Tokenizer Comparison Sessions ────────────────────────────────

export const comparisonSessions = mysqlTable("comparison_sessions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  name: varchar("name", { length: 255 }).notNull(),
  configIds: json("configIds").$type<number[]>().notNull(),
  testText: text("testText").notNull(),
  results: json("results").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ComparisonSession = typeof comparisonSessions.$inferSelect;
export type InsertComparisonSession = typeof comparisonSessions.$inferInsert;

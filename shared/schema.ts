import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameState = pgTable("game_state", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  articleId: text("article_id"),
  revealedWords: text("revealed_words").array(),
  guessedWords: text("guessed_words").array(),
  semanticScores: text("semantic_scores"), // JSON string
  startTime: timestamp("start_time").defaultNow(),
  completedAt: timestamp("completed_at"),
  isCompleted: boolean("is_completed").default(false),
});

export const proxyStats = pgTable("proxy_stats", {
  id: serial("id").primaryKey(),
  endpoint: text("endpoint").notNull(),
  responseTime: integer("response_time"),
  status: integer("status"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertGameStateSchema = createInsertSchema(gameState).omit({
  id: true,
  startTime: true,
});

export const insertProxyStatsSchema = createInsertSchema(proxyStats).omit({
  id: true,
  timestamp: true,
});

export type InsertGameState = z.infer<typeof insertGameStateSchema>;
export type GameState = typeof gameState.$inferSelect;
export type InsertProxyStats = z.infer<typeof insertProxyStatsSchema>;
export type ProxyStats = typeof proxyStats.$inferSelect;

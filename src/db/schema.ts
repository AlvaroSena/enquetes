import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const polls = pgTable("polls", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});
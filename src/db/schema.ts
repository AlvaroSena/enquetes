import { relations } from "drizzle-orm";
import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const polls = pgTable("polls", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const pollsRelations = relations(polls, ({ many }) => ({
  options: many(pollOptions),
}));

export const pollOptions = pgTable("poll_options", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  pollId: uuid().notNull().references(() => polls.id, { onDelete: "cascade" }),
});
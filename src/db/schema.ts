import { relations } from "drizzle-orm";
import { uniqueIndex } from "drizzle-orm/pg-core";
import { uuid, pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const polls = pgTable("polls", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const pollsRelations = relations(polls, ({ many }) => ({
  options: many(pollOptions),
  votes: many(votes),
}));

export const pollOptions = pgTable("poll_options", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  pollId: uuid().notNull().references(() => polls.id, { onDelete: "cascade" }),
});

export const pollOptionsRelations = relations(pollOptions, ({ many }) => ({
  votes: many(votes),
}));

export const votes = pgTable("votes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: text().notNull(),
  pollOptionId: uuid().notNull().references(() => pollOptions.id, { onDelete: "cascade" }),
  pollId: uuid().notNull().references(() => polls.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
}, (table) => ({
  voteSessionUnique: uniqueIndex("polls_vote_session_unique").on(
    table.sessionId,
    table.pollId,
  ),
}));
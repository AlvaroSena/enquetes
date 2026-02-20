import { db } from "..";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { PollsRepository } from "../../../domain/application/repositories/polls-repository";
import { Poll } from "../../../domain/enterprise/entities/poll";
import { polls } from "../schema";
import { DrizzleTransaction } from "../types/drizzle-types";

export class DrizzlePollsRepository implements PollsRepository {
  async create(poll: Poll, trx?: DrizzleTransaction): Promise<Poll> {
    const executor = trx ?? db;

    const [newPoll] = await executor.insert(polls).values({ title: poll.title }).returning();

    return Poll.create(
      {
        title: newPoll.title,
        createdAt: newPoll.createdAt,
        updatedAt: newPoll.updatedAt,
      },
      new UniqueEntityId(newPoll.id),
    );
  }
}

import { db } from "..";
import { PollsRepository } from "../../../domain/application/repositories/polls-repository";
import { Poll } from "../../../domain/enterprise/entities/poll";
import { PollMapper } from "../../../domain/enterprise/mappers/poll-mapper";
import { polls } from "../schema";
import { DrizzleTransaction } from "../types/drizzle-types";

export class DrizzlePollsRepository implements PollsRepository {
  async create(poll: Poll, trx?: DrizzleTransaction): Promise<Poll> {
    const executor = trx ?? db;

    const [newPoll] = await executor.insert(polls).values({ title: poll.title }).returning();

    return PollMapper.toDomain(newPoll);
  }
}

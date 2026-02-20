import { db } from "..";
import { PollOptionsRepository } from "../../../domain/application/repositories/poll-options-repository";
import { PollOption } from "../../../domain/enterprise/entities/poll-option";
import { PollOptionMapper } from "../../../domain/enterprise/mappers/poll-option-mapper";
import { pollOptions } from "../schema";
import { DrizzleTransaction } from "../types/drizzle-types";

export class DrizzlePollOptionsRepository implements PollOptionsRepository {
  async createMany(options: PollOption[], trx?: DrizzleTransaction): Promise<void> {
    const executor = trx ?? db;

    const formattedOptions = options.map((option) => {
      return PollOptionMapper.toPersistence(option);
    });

    await executor.insert(pollOptions).values(formattedOptions);
  }
}

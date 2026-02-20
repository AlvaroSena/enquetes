import { pollOptions } from "../../../infra/database/schema";
import { InferSelectModel } from "drizzle-orm";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { PollOption } from "../entities/poll-option";

type PersistencePollOption = InferSelectModel<typeof pollOptions>;

export class PollOptionMapper {
  static toDomain(raw: PersistencePollOption): PollOption {
    return PollOption.create(
      {
        title: raw.title,
        pollId: new UniqueEntityId(raw.pollId),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPersistence(pollOption: PollOption): PersistencePollOption {
    return {
      id: pollOption.id.toString(),
      title: pollOption.title,
      pollId: pollOption.pollId.toString(),
    };
  }
}

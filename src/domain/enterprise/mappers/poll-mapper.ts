import { Poll } from "../entities/poll";
import { polls } from "../../../infra/database/schema";
import { InferSelectModel } from "drizzle-orm";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";

type PersistencePoll = InferSelectModel<typeof polls>;

export class PollMapper {
  static toDomain(raw: PersistencePoll): Poll {
    return Poll.create(
      {
        title: raw.title,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPersistence(poll: Poll): PersistencePoll {
    return {
      id: poll.id.toString(),
      title: poll.title,
      createdAt: poll.createdAt,
      updatedAt: poll.updatedAt ?? poll.createdAt,
    };
  }
}

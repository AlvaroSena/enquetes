import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { Vote } from "../../enterprise/entities/vote";

export interface VotesRepository {
  findBySessionIdAndPollId(sessionId: string, pollId: UniqueEntityId): Promise<Vote | null>;
  create(vote: Vote): Promise<void>;
  delete(voteId: UniqueEntityId): Promise<void>;
}
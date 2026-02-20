import { Poll } from "../../enterprise/entities/poll";

export interface PollsRepository {
  create(poll: Poll, trx?: unknown): Promise<Poll>;
}

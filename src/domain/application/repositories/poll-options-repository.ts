import { PollOption } from "../../enterprise/entities/poll-option";

export interface PollOptionsRepository {
  createMany(options: PollOption[], trx?: unknown): Promise<void>
}
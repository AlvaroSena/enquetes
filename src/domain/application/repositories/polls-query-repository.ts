import { PollWithOptionsDTO } from "../dtos/poll-with-options-dto";

export interface PollsQueryRepository {
  findByIdWithOptions(pollId: string): Promise<PollWithOptionsDTO>;
}

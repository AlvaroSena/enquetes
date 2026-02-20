import { sql, eq } from "drizzle-orm";
import { PollWithOptionsDTO } from "../../../domain/application/dtos/poll-with-options-dto";
import { PollsQueryRepository } from "../../../domain/application/repositories/polls-query-repository";
import { pollOptions, polls } from "../schema";
import { db } from "..";

export class DrizzlePollsQueryRepository implements PollsQueryRepository {
  async findByIdWithOptions(pollId: string): Promise<PollWithOptionsDTO> {
    const queryResult = await db
      .select({
        id: polls.id,
        title: polls.title,
        createdAt: polls.createdAt,
        updatedAt: polls.updatedAt,
        options: sql`
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', ${pollOptions.id},
                    'title', ${pollOptions.title}
                  )
                ) FILTER (WHERE ${pollOptions.id} IS NOT NULL),
                '[]'
              )
            `.as("options"),
      })
      .from(polls)
      .leftJoin(pollOptions, eq(polls.id, pollOptions.pollId))
      .where(eq(polls.id, pollId))
      .groupBy(polls.id);

    const { options, ...rest } = queryResult[0];

    const pollWithOptions = {
      poll: {
        ...rest,
        options,
      },
    } as PollWithOptionsDTO;

    return pollWithOptions;
  }
}

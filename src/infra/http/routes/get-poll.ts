import { Router } from "express";
import { z } from "zod";
import { db } from "../../../infra/database";
import { polls, pollOptions } from "../../../infra/database/schema";
import { eq, sql } from "drizzle-orm";
import { redis } from "../../../infra/redis";

type PollOption = {
  id: string;
  title: string;
}

type PollQueryResult = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  options: PollOption[];
}

const getPoll = Router();

getPoll.get("/polls/:pollId", async (request, response) => {
  const getPollParams = z.object({
    pollId: z.uuid(),
  });

  try {
    const { pollId } = getPollParams.parse(request.params);

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

    const poll = queryResult[0] as PollQueryResult;

    if (!poll) {
      return response.status(404).json({ message: "Poll not found." });
    }

    const result = await redis.zrange(pollId, 0, -1, "WITHSCORES");

    const votes = result.reduce((obj, line, index) => {
      if (index % 2 === 0) {
        const score = result[index + 1];

        Object.assign(obj, { [line]: Number(score) });
      }

      return obj;
    }, {} as Record<string, number>);

    return response.json({
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map(option => {
          return {
            id: option.id,
            title: option.title,
            score: (option.id in votes) ? votes[option.id] : 0,
          }
        }),
      }
    });
  } catch {}
});

export { getPoll }
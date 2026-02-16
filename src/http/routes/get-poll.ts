import { Router } from "express";
import { z } from "zod";
import { db } from "../../db";
import { polls, pollOptions } from "../../db/schema";
import { eq, sql } from "drizzle-orm";

const getPoll = Router();

getPoll.get("/polls/:pollId", async (request, response) => {
  const getPollParams = z.object({
    pollId: z.uuid(),
  });

  try {
    const { pollId } = getPollParams.parse(request.params);

    const [poll] = await db
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


    return response.json({ poll });
  } catch {}
});

export { getPoll }
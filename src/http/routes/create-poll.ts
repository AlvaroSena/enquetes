import { Router } from "express";
import { z } from "zod";
import { db } from "../../db";
import { polls, pollOptions } from "../../db/schema";

const createPoll = Router();

createPoll.post("/polls", async (request, response) => {
  const createPollBody = z.object({
    title: z.string(),
    options: z.array(z.string()),
  });

  try {
    const { title, options } = createPollBody.parse(request.body);

    const pollId = await db.transaction(async tx => {
      const [poll] = await tx.insert(polls).values({ title }).returning();
        
      const formattedOptions = options.map(value => {
        return {
          title: value,
          pollId: poll.id,
        }
      })

      await tx.insert(pollOptions).values(formattedOptions);

      return poll.id
    });

    return response.status(201).json({ pollId })

  } catch {}
});

export { createPoll }
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db";
import { polls } from "../../db/schema";

const createPoll = Router();

createPoll.post("/polls", async (request, response) => {
  const createPollBody = z.object({
    title: z.string(),
  });

  try {
    const { title } = createPollBody.parse(request.body);

    const [poll] = await db.insert(polls).values({ title }).returning();

    return response.status(201).json({ pollId: poll.id });

  } catch {}
});

export { createPoll }
import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { db } from "../../infra/database";
import { votes } from "../../infra/database/schema";
import { and, eq } from "drizzle-orm";
import { redis } from "../../infra/redis";
import { voting } from "../../utils/voting-pub-sub";

const voteOnPoll = Router();

voteOnPoll.post("/polls/:pollId/votes", async (request, response) => {
 const voteOnPollParams = z.object({
    pollId: z.uuid(),
  });

  const voteOnPollBody = z.object({
    pollOptionId: z.uuid(),
  });

  try {

    const { pollId } = voteOnPollParams.parse(request.params);
    const { pollOptionId } = voteOnPollBody.parse(request.body);
   
    let { sessionId } = request.signedCookies;

    if (sessionId) {
      const [userVotedPreviouslyInThePoll] = await db
        .select().from(votes)
        .where(and(eq(votes.sessionId, sessionId), eq(votes.pollId, pollId)));
      
      if (userVotedPreviouslyInThePoll && userVotedPreviouslyInThePoll.pollOptionId === pollOptionId) {
        return response.status(409).json({ message: "User already has voted in this poll." });
      }

      await db.delete(votes).where(eq(votes.id, userVotedPreviouslyInThePoll.id));

      const currentlyVotesAmount = await redis.zincrby(pollId, -1, userVotedPreviouslyInThePoll.pollOptionId);

      voting.publish(pollId, { 
        pollOptionId: userVotedPreviouslyInThePoll.pollId,
        votes: Number(currentlyVotesAmount),
      });
    }

    if (!sessionId) {
      sessionId = randomUUID();

      response.cookie("sessionId", sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        signed: true,
        httpOnly: true,
      });
    }

    await db.insert(votes).values({ sessionId, pollId, pollOptionId });

    const currentlyVotesAmount = await redis.zincrby(pollId, 1, pollOptionId);

    voting.publish(pollId, { 
      pollOptionId,
      votes: Number(currentlyVotesAmount),
    });

    return response.status(201).send();
  } catch {
    return response.status(500).send("Internal server error")
  }
});

export { voteOnPoll }
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db";
import { polls, pollOptions } from "../../db/schema";

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
   
    

  } catch {}
});

export { voteOnPoll }
import { Router } from "express";
import { z } from "zod";
import { DrizzlePollsRepository } from "../../database/repositories/drizzle-polls-repository";
import { DrizzlePollOptionsRepository } from "../../database/repositories/drizzle-poll-options-repository";
import { CreatePollUseCase } from "../../../domain/application/use-cases/create-poll";
import { DrizzleUnitOfWork } from "../../database/drizzle-unit-of-work";

const createPoll = Router();

createPoll.post("/polls", async (request, response) => {
  const createPollBody = z.object({
    title: z.string(),
    options: z.array(z.string()),
  });

  const pollsRepository = new DrizzlePollsRepository();
  const pollOptionsRepository = new DrizzlePollOptionsRepository();
  const unitOfWork = new DrizzleUnitOfWork();

  const createPollUseCase = new CreatePollUseCase(pollsRepository, pollOptionsRepository, unitOfWork);

  try {
    const { title, options } = createPollBody.parse(request.body);

    const { pollId } = await createPollUseCase.execute({ title, options });

    return response.status(201).json({ pollId: pollId.toString() });
  } catch (err) {
    console.log(err);
  }
});

export { createPoll };

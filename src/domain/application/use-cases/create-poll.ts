import { UnitOfWork } from "../../../core/unit-of-work";
import { Poll } from "../../enterprise/entities/poll";
import { PollOption } from "../../enterprise/entities/poll-option";
import { PollOptionsRepository } from "../repositories/poll-options-repository";
import { PollsRepository } from "../repositories/polls-repository";

interface CreatePollUseCaseRequest {
  title: string;
  options: string[];
}

export class CreatePollUseCase {
  constructor(
    private pollsRepository: PollsRepository, 
    private pollOptionsRepository: PollOptionsRepository, 
    private unitOfWork: UnitOfWork,
  ) {}

  async execute({ title, options }: CreatePollUseCaseRequest) {
    const pollId = await this.unitOfWork.execute(async (trx) => {
      const newPoll = Poll.create({ title });

      const poll = await this.pollsRepository.create(newPoll, trx);

      const formattedOptions = options.map(value => {
        return PollOption.create({
          title: value,
          pollId: poll.id,
        })
      })

      await this.pollOptionsRepository.createMany(formattedOptions, trx);

      return poll.id;
    });

    return {
      pollId,
    }
  }
}
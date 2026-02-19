import { PollsRepository } from "../repositories/polls-repository";

interface CreatePollUseCaseRequest {
  title: string;
  options: string[];
}

export class CreatePollUseCase {
  constructor(private pollsRepository: PollsRepository) {}

  async execute({  }: CreatePollUseCaseRequest) {}
}
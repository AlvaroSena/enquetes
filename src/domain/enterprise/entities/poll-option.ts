import { Entity } from "../../../core/entities/Entity";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { Optional } from "../../../core/types/optional";

interface PollOptionProps {
  title: string;
  pollId: UniqueEntityId;
}

export class PollOption extends Entity<PollOptionProps> {
  get title(): string {
    return this.props.title;
  }

  get pollId(): UniqueEntityId {
    return this.props.pollId;
  }

  static create(props: PollOptionProps, id?: UniqueEntityId) {
    const pollOption = new PollOption({
      ...props,
    }, id); 

    return pollOption;
  }
}
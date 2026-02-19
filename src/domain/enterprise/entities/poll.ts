import { Entity } from "../../../core/entities/Entity";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { Optional } from "../../../core/types/optional";

interface PollProps {
  title: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Poll extends Entity<PollProps> {
  get title(): string {
    return this.props.title;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set title(title: string) {
    this.props.title = title;
    this.touch();
  }

  static create(props: Optional<PollProps, "createdAt">, id?: UniqueEntityId) {
    const poll = new Poll({
      ...props,
      createdAt: new Date(),
    }, id); 

    return poll;
  }
}
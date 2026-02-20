import { Entity } from "../../../core/entities/Entity";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { Optional } from "../../../core/types/optional";

interface VoteProps {
  sessionId: string;
  pollOptionId: UniqueEntityId;
  pollId: UniqueEntityId;
  createdAt: Date;
}

export class Vote extends Entity<VoteProps> {
  get sessionId(): string {
    return this.props.sessionId;
  }

  get pollOptionId(): UniqueEntityId {
    return this.props.pollOptionId;
  }

  get pollId(): UniqueEntityId {
    return this.props.pollId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(props: Optional<VoteProps, "createdAt">, id?: UniqueEntityId) {
    const vote = new Vote(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return vote;
  }
}

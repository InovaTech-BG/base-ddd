import { Id } from "../entities/value-objects/id";
import { UniqueEntityId } from "../entities/value-objects/unique-entity-id";
import { DomainEvent } from "./domain-event";

export type EventHandler<
	T extends DomainEvent<IdType>,
	IdType extends Id<unknown> = UniqueEntityId,
> = {
	handle(event: T): void;
};

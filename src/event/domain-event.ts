import { Id } from "../entities/value-objects/id";
import { UniqueEntityId } from "../entities/value-objects/unique-entity-id";

export interface DomainEvent<IdType extends Id<unknown> = UniqueEntityId> {
	ocurredAt: Date;
	getAggregateId(): IdType;
}

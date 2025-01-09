import { DomainEvent } from "../events/domain-event";
import { DomainEvents } from "../events/domain-events";
import { Entity, EntityProps } from "./entity";
import { Id } from "./value-objects/id";
import { UniqueEntityId } from "./value-objects/unique-entity-id";

export class AggregateRoot<
	Props extends EntityProps,
	IdType extends Id<unknown> = UniqueEntityId,
> extends Entity<Props, IdType> {
	protected currentUserUsingId?: IdType;
	private _domainEvents: DomainEvent<IdType>[] = [];

	set currentUserUsing(value: IdType | undefined) {
		this.currentUserUsingId = value;
	}

	get domainEvents() {
		return this._domainEvents;
	}

	protected addDomainEvent(domainEvent: DomainEvent<IdType>): void {
		this._domainEvents.push(domainEvent);
		DomainEvents.markedAggregateForDispatch(this);
	}

	public clearEvents(): void {
		this._domainEvents = [];
	}
}

import { DomainEvent } from "../event/domain-event";
import { DomainEvents } from "../event/domain-events";
import { Entity } from "./entity";
import { Id } from "./value-objects/id";
import { UniqueEntityId } from "./value-objects/unique-entity-id";

export class Aggregate<
	Props,
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

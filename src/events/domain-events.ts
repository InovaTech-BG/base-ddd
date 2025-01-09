import { EntityProps } from "../entities";
import { AggregateRoot } from "../entities/aggregate";
import { Id } from "../entities/value-objects/id";
import { UniqueEntityId } from "../entities/value-objects/unique-entity-id";
import { DomainEvent } from "./domain-event";
import { EventHandler } from "./event-handler";

export class DomainEvents {
	private static handlersMap: Record<
		string,
		EventHandler<DomainEvent<Id<unknown>>, Id<unknown>>[]
	> = {};
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private static markedAggregates: AggregateRoot<any, Id<unknown>>[] = [];

	public static markedAggregateForDispatch(
		aggregate: AggregateRoot<any, Id<unknown>>,
	) {
		const aggregateFound = !!DomainEvents.findMarkedAggregateByID(aggregate.id);

		if (!aggregateFound) {
			DomainEvents.markedAggregates.push(aggregate);
		}
	}

	private static dispatchAggregateEvents<T extends EntityProps>(
		aggregate: AggregateRoot<T, Id<unknown>>,
	) {
		for (const event of aggregate.domainEvents) {
			DomainEvents.dispatch(event);
		}
	}

	private static removeAggregateFromMarkedDispatchList(
		aggregate: AggregateRoot<any, Id<unknown>>,
	) {
		const index = DomainEvents.markedAggregates.findIndex((a) =>
			a.equals(aggregate),
		);
	}

	private static findMarkedAggregateByID<
		T extends Id<unknown> = UniqueEntityId,
	>(id: T) {
		return DomainEvents.markedAggregates.find((a) => a.id.equals(id));
	}

	public static dispatchEventsForAggregate(id: Id<unknown>) {
		const aggregate = DomainEvents.findMarkedAggregateByID(id);

		if (aggregate) {
			DomainEvents.dispatchAggregateEvents(aggregate);
			aggregate.clearEvents();
			DomainEvents.removeAggregateFromMarkedDispatchList(aggregate);
		}
	}

	public static register<T extends DomainEvent<Id<unknown>>>(
		callback: EventHandler<T, Id<unknown>>,
		eventClassName: string,
	) {
		const wasEventRegisteredBefore = eventClassName in DomainEvents.handlersMap;

		if (!wasEventRegisteredBefore) {
			DomainEvents.handlersMap[eventClassName] = [];
		}

		DomainEvents.handlersMap[eventClassName].push(
			callback as EventHandler<T, Id<unknown>>,
		);
	}

	public static clearHandlers() {
		DomainEvents.handlersMap = {};
	}

	public static clearMarkedAggregates() {
		DomainEvents.markedAggregates = [];
	}

	public static dispatch(event: DomainEvent<Id<unknown>>) {
		const eventClassName: string = event.constructor.name;

		const isEventRegistered = eventClassName in DomainEvents.handlersMap;

		if (isEventRegistered) {
			const handlers = DomainEvents.handlersMap[eventClassName];

			for (const eventHandler of handlers) {
				eventHandler.handle(event);
			}
		}
	}
}

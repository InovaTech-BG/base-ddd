import { Mock } from "vitest";
import { Aggregate } from "../entities/aggregate";
import {
	UniqueEntityId,
	UniqueEntityIdConstructor,
} from "../entities/value-objects/unique-entity-id";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";
import { EventHandler } from "./event-handler";

class CustomAggregateCreated implements DomainEvent {
	ocurredAt: Date;
	private aggregate: CustomAggregate;

	constructor(aggregate: CustomAggregate) {
		this.ocurredAt = new Date();
		this.aggregate = aggregate;
	}

	public getAggregateId(): UniqueEntityId {
		return this.aggregate.id;
	}
}

class CustomAggregate extends Aggregate<null, UniqueEntityId> {
	static create() {
		const customAggregate = new CustomAggregate(
			null,
			new UniqueEntityIdConstructor(),
		);

		customAggregate.addDomainEvent(new CustomAggregateCreated(customAggregate));
		return customAggregate;
	}
}

class CustomAggregateEventHandler
	implements EventHandler<CustomAggregateCreated>
{
	fn: Mock<() => void>;

	constructor(fn: Mock<() => void>) {
		this.fn = fn;
	}

	handle(event: CustomAggregateCreated): void {
		this.fn();
	}
}

describe("DomainEvents", () => {
	it("should be able to dispatch and listen to events", () => {
		const callbackSpy = vi.fn();

		const eventHandler = new CustomAggregateEventHandler(callbackSpy);

		DomainEvents.register(eventHandler, CustomAggregateCreated.name);

		const aggregate = CustomAggregate.create();

		expect(aggregate.domainEvents).toHaveLength(1);

		DomainEvents.dispatchEventsForAggregate(aggregate.id);

		expect(callbackSpy).toHaveBeenCalledTimes(1);
		expect(aggregate.domainEvents).toHaveLength(0);
	});
});

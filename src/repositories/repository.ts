import { Entity, EntityProps } from "../entities";
import { Id, UniqueEntityId } from "../entities/value-objects";

export interface Repository<
	T extends Entity<EntityProps, K>,
	K extends Id<unknown> = UniqueEntityId,
> {
	create(entity: T): Promise<void>;
	save(entity: T): Promise<void>;
	delete(entity: T): Promise<void>;
	exists(entity: T): Promise<boolean>;
	getById(id: K): Promise<T | null>;
}

import { Entity, EntityProps } from "../entities";
import { Id, UniqueEntityId } from "../entities/value-objects";
import { Repository } from "./repository";

export abstract class InMemoryRepository<
	T extends Entity<EntityProps, K>,
	K extends Id<unknown> = UniqueEntityId,
> implements Repository<T, K>
{
	public items: T[] = [];

	async create(entity: T): Promise<void> {
		this.items.push(entity);
	}

	async save(entity: T): Promise<void> {
		const index = this.items.findIndex((item) => item.equals(entity));

		if (index !== -1) {
			this.items[index] = entity;
		}
	}

	async delete(entity: T): Promise<void> {
		const index = this.items.findIndex((item) => item.equals(entity));

		if (index !== -1) {
			this.items.splice(index, 1);
		}
	}

	async exists(entity: T): Promise<boolean> {
		return this.items.some((item) => item.equals(entity));
	}

	async getById(id: K): Promise<T | null> {
		const entity = this.items.find((item) => item.id.equals(id));

		if (!entity) {
			return null;
		}

		return entity;
	}
}

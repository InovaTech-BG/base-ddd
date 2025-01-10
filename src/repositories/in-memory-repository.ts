import { Entity, ExtractId } from "../entities";
import { Id } from "../entities/value-objects";
import { Repository } from "./repository";

export abstract class InMemoryRepository<T extends Entity<any, Id<unknown>>>
	implements Repository<T>
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

	async existsById(id: ExtractId<T>): Promise<boolean> {
		return this.items.some((item) => item.id.equals(id));
	}

	async getById(id: ExtractId<T>): Promise<T | null> {
		const entity = this.items.find((item) => item.id.equals(id));

		if (!entity) {
			return null;
		}

		return entity;
	}
}

import { Entity, ExtractId } from "../entities";
import { Id } from "../entities/value-objects";

export interface Repository<T extends Entity<any, Id<unknown>>> {
	create(entity: T): Promise<void>;
	save(entity: T): Promise<void>;
	delete(entity: T): Promise<void>;
	exists(entity: T): Promise<boolean>;
	getById(id: ExtractId<T>): Promise<T | null>;
}

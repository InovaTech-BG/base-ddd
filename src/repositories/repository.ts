import { Entity, ExtractId } from "../entities";
import { Id } from "../entities/value-objects";

export interface Repository<T extends Entity<any, Id<unknown>>> {
	create(entity: T): Promise<T>;
	save(entity: T): Promise<T>;
	delete(entity: T): Promise<void>;
	exists(entity: T): Promise<boolean>;
	existsById(id: ExtractId<T>): Promise<boolean>;
	getById(id: ExtractId<T>): Promise<T | null>;
}

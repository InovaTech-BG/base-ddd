import { Id, IdConstructor } from "./id";

export class IncrementalEntityId extends Id<number> {
	public static create(id?: number): IncrementalEntityId {
		return new IncrementalEntityId(id ?? -1);
	}

	public id(): number {
		return this.value;
	}
}

export class IncrementalEntityIdConstructor extends IdConstructor<IncrementalEntityId> {
	public create(id?: number): IncrementalEntityId {
		return IncrementalEntityId.create(id);
	}
}

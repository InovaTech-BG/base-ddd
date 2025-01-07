import { randomUUID } from "node:crypto";
import { Id, IdConstructor } from "./id";

export class UniqueEntityId extends Id<string> {
	public id(): string {
		return this.value;
	}
}

export class UniqueEntityIdConstructor extends IdConstructor<UniqueEntityId> {
	public create(id?: string): UniqueEntityId {
		return new UniqueEntityId(id ?? randomUUID());
	}
}

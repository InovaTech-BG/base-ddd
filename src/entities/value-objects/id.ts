import { ValueObject } from "./value-object";

export abstract class Id<Type> extends ValueObject<Type> {
	public abstract id(): Type;
}

export type IdType<Type> = Type extends ValueObject<infer Value>
	? Value
	: never;

export abstract class IdConstructor<Type, Value = IdType<Type>> {
	public abstract create(id?: Value): Type;
}

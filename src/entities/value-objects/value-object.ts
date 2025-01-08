export abstract class ValueObject<T> {
	protected readonly _value: T;

	protected constructor(value: T) {
		this._value = value;
	}

	get value(): T {
		return this._value;
	}

	toString(): string {
		return JSON.stringify(this._value);
	}

	public equals(vo: ValueObject<T>): boolean {
		if (vo === null || vo === undefined) {
			return false;
		}

		return this.toString() === vo.toString();
	}

	get cleanValue(): CleanValueObject<T> {
		if (!(this.value instanceof Object)) {
			return this._value as unknown as CleanValueObject<T>;
		}
		if (Array.isArray(this.value)) {
			return (this._value as Array<unknown>).map((value: unknown) => {
				if (value instanceof Object) {
					return this._cleanValue(value);
				}
				return value;
			}) as unknown as CleanValueObject<T>;
		}
		return this._cleanValue(this._value as Object);
	}

	private _cleanValue(value: Object) {
		return Object.keys(value).reduce(
			(acc, key) => {
				const typedKey = key as keyof typeof value;
				if (value[typedKey] instanceof ValueObject) {
					acc[key] = (value[typedKey] as ValueObject<unknown>).cleanValue;
				} else {
					acc[key] = value[typedKey];
				}
				return acc;
			},
			{} as Record<string, unknown>,
		) as unknown as CleanValueObject<T>;
	}
}

type CleanValueObject<T> = {
	[K in keyof T]: T[K] extends ValueObject<infer U>
		? CleanValueObject<U>
		: T[K];
};

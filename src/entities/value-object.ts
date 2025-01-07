export abstract class ValueObject<T> {
	protected readonly _value: T;

	constructor(value: T) {
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

	get cleanValue(): CleanValueObject<T, this> {
		if (!(this.value instanceof Object)) {
			if(Array.isArray(this.value)) {
        return (this._value as Array<unknown>).map((value: unknown) => {
          if (value instanceof ValueObject) {
            return value.cleanValue;
          }
          return value;
        }) as unknown as CleanValueObject<T, this>;
      }
      return this._value as unknown as CleanValueObject<T, this>;
		}
		return Object.keys(this.value).reduce(
			(acc, key) => {
				const typedKey = key as keyof T;
				if (this._value[typedKey] instanceof ValueObject) {
					acc[key] = (this._value[typedKey] as ValueObject<unknown>).cleanValue;
				} else {
					acc[key] = this._value[typedKey];
				}
        return acc;
			},
			{} as Record<string, unknown>,
		) as unknown as CleanValueObject<T, this>;
	}
}

type CleanValueObject<T, V extends ValueObject<T>> = {
  [K in keyof T]: T[K] extends ValueObject<infer U> ? CleanValueObject<U, T[K]> : T[K];
}

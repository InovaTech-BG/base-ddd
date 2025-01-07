import { ValueObject } from "./value-object";

export class Searchable extends ValueObject<string> {
	public static create(searchable: string): Searchable {
		return new Searchable(searchable.toLocaleLowerCase());
	}

	public static createFromTexts(...texts: string[]): Searchable {
		return new Searchable(texts.join(" ").toLocaleLowerCase());
	}

	search(searchable: string): boolean {
		return this._value.includes(searchable.toLocaleLowerCase());
	}
}

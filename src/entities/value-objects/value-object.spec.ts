import { ValueObject } from "./value-object";

class CustomVO extends ValueObject<{ name: string; age: number }> {}

class CustomComplexVO extends ValueObject<{ name: string; child: CustomVO }> {}

class CustomArrayVO extends ValueObject<{ name: string; child: CustomVO }[]> {}

class CustomEqualsVO extends ValueObject<{ name: string; age: number }> {
	equals(vo: CustomEqualsVO): boolean {
		return this.value.name === vo.value.name;
	}
}

describe("ValueObject", () => {
	it("should be able to define and get value", () => {
		const vo = new CustomVO({ name: "John", age: 20 });
		expect(vo).toBeDefined();
		expect(vo.value).toMatchObject({ name: "John", age: 20 });
	});

	it("should be able to define complex vo and get value", () => {
		const vo = new CustomComplexVO({
			name: "John",
			child: new CustomVO({ name: "Doe", age: 20 }),
		});
		expect(vo).toBeDefined();
		expect(vo.value).toMatchObject({
			name: "John",
		});
		expect(vo.value.child.value).toMatchObject({ name: "Doe", age: 20 });
	});

	it("should be able to define array vo and get value", () => {
		const vo = new CustomArrayVO([
			{ name: "John", child: new CustomVO({ name: "Doe", age: 20 }) },
			{ name: "Jane", child: new CustomVO({ name: "Doe", age: 20 }) },
		]);
		expect(vo).toBeDefined();
		expect(vo.value).toMatchObject([{ name: "John" }, { name: "Jane" }]);
	});

	it("should be able to get clean value", () => {
		const vo = new CustomComplexVO({
			name: "John",
			child: new CustomVO({ name: "Doe", age: 20 }),
		});
		expect(vo.cleanValue).toMatchObject({
			name: "John",
			child: { name: "Doe" },
		});
	});

	it("should be able to get clean value from array", () => {
		const vo = new CustomArrayVO([
			{ name: "John", child: new CustomVO({ name: "Doe", age: 20 }) },
			{ name: "Jane", child: new CustomVO({ name: "Doe", age: 20 }) },
		]);
		expect(vo.cleanValue).toMatchObject([
			{ name: "John", child: { name: "Doe" } },
			{ name: "Jane", child: { name: "Doe" } },
		]);
	});

	it("should be able to compare two value objects", () => {
		const vo1 = new CustomComplexVO({
			name: "John",
			child: new CustomVO({ name: "Doe", age: 20 }),
		});
		const vo2 = new CustomComplexVO({
			name: "John",
			child: new CustomVO({ name: "Doe", age: 20 }),
		});
		const vo3 = new CustomComplexVO({
			name: "Jane",
			child: new CustomVO({ name: "Doe", age: 20 }),
		});
		const vo4 = new CustomComplexVO({
			name: "John",
			child: new CustomVO({ name: "Doe", age: 21 }),
		});

		expect(vo1.equals(vo2)).toBeTruthy();
		expect(vo1.equals(vo3)).toBeFalsy();
		expect(vo1.equals(vo4)).toBeFalsy();
	});

	it("should be able to compare two value objects with custom equals method", () => {
		const vo1 = new CustomEqualsVO({ name: "John", age: 20 });
		const vo2 = new CustomEqualsVO({ name: "John", age: 21 });
		const vo3 = new CustomEqualsVO({ name: "Jane", age: 20 });

		expect(vo1.equals(vo2)).toBeTruthy();
		expect(vo1.equals(vo3)).toBeFalsy();
	});

	it("should be able to get stringified value", () => {
		const vo = new CustomVO({ name: "John", age: 20 });
		expect(vo.toString()).toEqual('{"name":"John","age":20}');
	});
});

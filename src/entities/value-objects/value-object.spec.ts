import { ValueObject } from "./value-object";

class CustomVO extends ValueObject<{ name: string; age: number }> {
	public static create(name: string, age: number): CustomVO {
		return new CustomVO({ name, age });
	}
}

class CustomComplexVO extends ValueObject<{ name: string; child: CustomVO }> {
	public static create(name: string, child: CustomVO): CustomComplexVO {
		return new CustomComplexVO({ name, child });
	}
}

class CustomArrayVO extends ValueObject<{ name: string; child: CustomVO }[]> {
	public static create(
		items: { name: string; child: CustomVO }[],
	): CustomArrayVO {
		return new CustomArrayVO(items);
	}
}

class CustomEqualsVO extends ValueObject<{ name: string; age: number }> {
	public static create(name: string, age: number): CustomEqualsVO {
		return new CustomEqualsVO({ name, age });
	}

	equals(vo: CustomEqualsVO): boolean {
		return this.value.name === vo.value.name;
	}
}

describe("ValueObject", () => {
	it("should be able to define and get value", () => {
		const vo = CustomVO.create("John", 20);
		expect(vo).toBeDefined();
		expect(vo.value).toMatchObject({ name: "John", age: 20 });
	});

	it("should be able to define complex vo and get value", () => {
		const vo = CustomComplexVO.create("John", CustomVO.create("Doe", 20));
		expect(vo).toBeDefined();
		expect(vo.value).toMatchObject({
			name: "John",
		});
		expect(vo.value.child.value).toMatchObject({ name: "Doe", age: 20 });
	});

	it("should be able to define array vo and get value", () => {
		const vo = CustomArrayVO.create([
			{ name: "John", child: CustomVO.create("Doe", 20) },
			{ name: "Jane", child: CustomVO.create("Doe", 20) },
		]);
		expect(vo).toBeDefined();
		expect(vo.value).toMatchObject([{ name: "John" }, { name: "Jane" }]);
	});

	it("should be able to get clean value", () => {
		const vo = CustomComplexVO.create("John", CustomVO.create("Doe", 20));
		expect(vo.cleanValue).toMatchObject({
			name: "John",
			child: { name: "Doe" },
		});
	});

	it("should be able to get clean value from array", () => {
		const vo = CustomArrayVO.create([
			{ name: "John", child: CustomVO.create("Doe", 20) },
			{ name: "Jane", child: CustomVO.create("Doe", 20) },
		]);
		expect(vo.cleanValue).toMatchObject([
			{ name: "John", child: { name: "Doe" } },
			{ name: "Jane", child: { name: "Doe" } },
		]);
	});

	it("should be able to compare two value objects", () => {
		const vo1 = CustomComplexVO.create("John", CustomVO.create("Doe", 20));
		const vo2 = CustomComplexVO.create("John", CustomVO.create("Doe", 20));
		const vo3 = CustomComplexVO.create("Jane", CustomVO.create("Doe", 20));
		const vo4 = CustomComplexVO.create("John", CustomVO.create("Doe", 21));

		expect(vo1.equals(vo2)).toBeTruthy();
		expect(vo1.equals(vo3)).toBeFalsy();
		expect(vo1.equals(vo4)).toBeFalsy();
	});

	it("should be able to compare two value objects with custom equals method", () => {
		const vo1 = CustomEqualsVO.create("John", 20);
		const vo2 = CustomEqualsVO.create("John", 21);
		const vo3 = CustomEqualsVO.create("Jane", 20);

		expect(vo1.equals(vo2)).toBeTruthy();
		expect(vo1.equals(vo3)).toBeFalsy();
	});

	it("should be able to get stringified value", () => {
		const vo = CustomVO.create("John", 20);
		expect(vo.toString()).toEqual('{"name":"John","age":20}');
	});
});

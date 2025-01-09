import { Entity, EntityProps } from "../entities";
import {
	UniqueEntityId,
	UniqueEntityIdConstructor,
} from "../entities/value-objects";
import { InMemoryRepository } from "./in-memory-repository";
import { Repository } from "./repository";

interface CustomEntityProps extends EntityProps {
	name: string;
	age: number;
}

class CustomEntity extends Entity<CustomEntityProps> {
	public static create(props: CustomEntityProps, id?: UniqueEntityId) {
		return new CustomEntity(props, id ?? new UniqueEntityIdConstructor());
	}

	get name() {
		return this.props.name;
	}

	set name(name: string) {
		this.props.name = name;
	}

	get age() {
		return this.props.age;
	}

	set age(age: number) {
		this.props.age = age;
	}
}

interface CustomRepository extends Repository<CustomEntity> {
	customMethod(): void;
}

class CustomInMemoryRepository
	extends InMemoryRepository<CustomEntity>
	implements CustomRepository
{
	customMethod(): void {
		this.items = [];
	}
}

describe("InMemoryRepository", () => {
	it("should be able to create", async () => {
		const repository = new CustomInMemoryRepository();
		const entity = CustomEntity.create({ name: "John Doe", age: 30 });

		await repository.create(entity);

		expect(repository.items.length).toBe(1);
	});

	it("should be able to save", async () => {
		const repository = new CustomInMemoryRepository();
		const entity = CustomEntity.create({ name: "John Doe", age: 30 });

		await repository.create(entity);

		entity.name = "Jane Doe";

		await repository.save(entity);

		expect(repository.items[0].name).toBe("Jane Doe");
	});

	it("should be able to delete", async () => {
		const repository = new CustomInMemoryRepository();
		const entity = CustomEntity.create({ name: "John Doe", age: 30 });

		await repository.create(entity);

		await repository.delete(entity);

		expect(repository.items.length).toBe(0);
	});

	it("should be able to check if entity exists", async () => {
		const repository = new CustomInMemoryRepository();
		const entity = CustomEntity.create({ name: "John Doe", age: 30 });

		await repository.create(entity);

		expect(await repository.exists(entity)).toBe(true);
	});

	it("should be able to get entity by id", async () => {
		const repository = new CustomInMemoryRepository();
		const entity = CustomEntity.create({ name: "John Doe", age: 30 });

		await repository.create(entity);

		const foundEntity = await repository.getById(entity.id);

		expect(foundEntity).toBe(entity);
	});

	it("should be able to call custom method", async () => {
		const repository = new CustomInMemoryRepository();

		repository.items.push(CustomEntity.create({ name: "John Doe", age: 30 }));

		repository.customMethod();

		expect(repository.items.length).toBe(0);
	});
});

import { Either, right } from "@inovatechbg/either";
import { Mock } from "vitest";
import z from "zod";
import { Dependency } from "../dependecies";
import { Entity, EntityProps } from "../entities";
import {
	UniqueEntityId,
	UniqueEntityIdConstructor,
} from "../entities/value-objects";
import { InMemoryRepository, Repository } from "../repositories";
import { Service } from "../services/service";
import { UseCase } from "./use-case";

interface CustomEntityProps extends EntityProps {
	name: string;
	age: number;
}

type Procedure = (...args: any[]) => any;

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
	existsByName(name: string): Promise<boolean>;
}

class CustomInMemoryRepository
	extends InMemoryRepository<CustomEntity>
	implements CustomRepository
{
	async existsByName(name: string): Promise<boolean> {
		return this.items.some((item) => item.name === name);
	}
}

class SpyDependency extends Dependency<{}> {
	spy: Mock<Procedure>;

	constructor(mock: Mock<Procedure>) {
		super({ dependencies: {} });
		this.spy = mock;
	}

	do() {
		this.spy();
		return;
	}
}

interface CustomServiceDependencies {
	spyDependency: SpyDependency;
}

class CustomService extends Service<CustomServiceDependencies> {
	private get spyDependency() {
		return this.deps.spyDependency;
	}

	constructor(dependencies: CustomServiceDependencies) {
		super({ dependencies });
	}

	doSomething(): Either<Error, string> {
		this.spyDependency.do();
		return right("Something");
	}
}

interface CreateCustomUseCaseProps {
	name: string;
	age: number;
}

const createCustomUseCaseSchema = z.object({
	name: z.string(),
	age: z.coerce.number(),
});

interface CreateUserDependencies {
	customRepository: CustomRepository;
}

class CreateCustomUseCase extends UseCase<
	CreateCustomUseCaseProps,
	Error,
	CustomEntity,
	CreateUserDependencies
> {
	private get customRepository() {
		return this.deps.customRepository;
	}

	constructor(dependencies: CreateUserDependencies) {
		super({
			schema: createCustomUseCaseSchema,
			dependencies: dependencies,
		});
	}

	protected async perform(
		params: CreateCustomUseCaseProps,
	): Promise<Either<Error, CustomEntity>> {
		const entity = CustomEntity.create(params);

		const exists = await this.customRepository.existsByName(entity.name);

		if (exists) {
			return this.left(new Error("Entity already exists"));
		}

		this.customRepository.create(entity);

		return this.right(entity);
	}
}

describe("CreateCustomUseCase", () => {
	it("should 1 + 1 equals 2", () => {
		const customRepository = new CustomInMemoryRepository();
		const spy = vi.fn();
		const spyDependency = new SpyDependency(spy);
		const customService = new CustomService({ spyDependency });
		const dependencies = {
			customRepository,
			customService,
		};

		const createCustomUseCase = new CreateCustomUseCase(dependencies);

		createCustomUseCase.execute({ name: "John", age: 20 });
	});
});

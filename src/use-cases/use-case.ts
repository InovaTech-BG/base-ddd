import { Either, EitherAsync } from "@inovatechbg/either";
import z, { ZodError } from "zod";
import { Entity } from "../entities";
import { Repository } from "../repositories";
import { Service } from "../services/service";

// biome-ignore lint:
type AllowedDependency = Repository<Entity<any>> | Service;
type Dependencies<T extends Record<string, AllowedDependency>> = {
	[K in keyof T]: T[K];
};
export type UseCaseDependencies = Dependencies<
	Record<string, AllowedDependency>
>;

type eitherMethod = (
	// biome-ignore lint:
	...args: any[]
	// biome-ignore lint:
) => Either<any, any> | Promise<Either<any, any>> | Promise<void>;

type dependency = AllowedDependency;

export abstract class UseCase<
	Params,
	Failure,
	Success,
	// biome-ignore lint:
> extends EitherAsync<Params, Failure | ZodError<any>, Success> {
	// biome-ignore lint:
	protected readonly schema: z.ZodType<any, any, any>;

	// biome-ignore lint:
	[methodName: string]: eitherMethod | dependency | z.ZodType<any, any, any>;

	constructor({
		schema,
		dependencies,
	}: {
		// biome-ignore lint:
		schema: z.ZodType<any, any, any>;
		dependencies: UseCaseDependencies;
	}) {
		super();

		this.schema = schema;

		for (const key of Object.keys(dependencies)) {
			this[key] = dependencies[key];
		}
	}

	public async execute(params: Params) {
		const parseResult = this.schema.safeParse(params);
		if (!parseResult.success) {
			const failure = parseResult.error;
			await this.handleFailure(params, failure);
			return this.left(failure);
		}

		const validParams = parseResult.data;

		await this.preExecute(validParams);

		const result = await this.perform(validParams);
		if (result.isLeft()) {
			await this.handleFailure(validParams, result.extract());
		}

		await this.postExecute(validParams, result);

		return result;
	}

	protected async preExecute(_params: Params): Promise<void> {
		return;
	}

	protected abstract perform(params: Params): Promise<Either<Failure, Success>>;

	protected async postExecute(
		_params: Params,
		_result: Either<Failure, Success>,
	): Promise<void> {
		return;
	}

	protected async handleFailure(
		_params: Params,
		// biome-ignore lint:
		_failure: Failure | ZodError<any>,
	): Promise<void> {
		return;
	}
}

import { Either, EitherAsync } from "@inovatechbg/either";
import z, { ZodError } from "zod";
import { Entity } from "../entities";
import { Id } from "../entities/value-objects";
import { Repository } from "../repositories";
import { Service } from "../services/service";

type AllowedDependency = Repository<Entity<any, Id<unknown>>> | Service;
type Dependencies<T extends Record<string, AllowedDependency>> = {
	[K in keyof T]: T[K];
};
export type UseCaseDependencies = Dependencies<
	Record<string, AllowedDependency>
>;

type eitherMethod = (
	...args: any[]
) => Either<any, any> | Promise<Either<any, any>> | Promise<void>;

type dependency = AllowedDependency;

export abstract class UseCase<Params, Failure, Success> extends EitherAsync<
	Params,
	Failure | ZodError<any>,
	Success
> {
	protected readonly schema: z.ZodType<any, any, any>;

	[methodName: string]: eitherMethod | dependency | z.ZodType<any, any, any>;

	constructor(
		{
			schema,
			dependencies,
		}: {
			schema: z.ZodType<any, any, any>;
			dependencies: UseCaseDependencies;
		},
		self: UseCase<Params, Failure, Success>,
	) {
		super();

		this.schema = schema;

		for (const key of Object.keys(dependencies)) {
			self[key] = dependencies[key];
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
		_failure: Failure | ZodError<any>,
	): Promise<void> {
		return;
	}
}

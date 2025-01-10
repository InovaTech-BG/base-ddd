import { Either, EitherAsync } from "@inovatechbg/either";
import z, { ZodError } from "zod";
import { ExtractDeps } from "../dependecies";
import { Entity } from "../entities";
import { Id } from "../entities/value-objects";
import { Repository } from "../repositories";
import { Service } from "../services/service";

type AllowedDependency = Repository<Entity<any, Id<unknown>>> | Service<any>;

export abstract class UseCase<
	Params,
	Failure,
	Success,
	Deps extends ExtractDeps<Deps, AllowedDependency>,
> extends EitherAsync<Params, Failure | ZodError<any>, Success> {
	protected readonly schema: z.ZodType<any, any, any>;

	protected readonly deps: Deps = {} as Deps;

	constructor({
		schema,
		dependencies,
	}: {
		schema: z.ZodType<any, any, any>;
		dependencies: Deps;
	}) {
		super();

		this.schema = schema;

		Object.assign(this.deps, dependencies);
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

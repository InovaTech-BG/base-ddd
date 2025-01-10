import { Either } from "@inovatechbg/either";
import { Dependency } from "../dependecies/dependency";

type AllowedDependency = Dependency;
type Dependencies<T extends Record<string, AllowedDependency>> = {
	[K in keyof T]: T[K];
};
export type ServiceDependencies = Dependencies<
	Record<string, AllowedDependency>
>;

type eitherMethod = (
	...args: any[]
) => Either<any, any> | Promise<Either<any, any>>;

type dependency = AllowedDependency;

export class Service {
	[methodName: string]: eitherMethod | dependency;

	constructor({
		dependencies,
	}: {
		dependencies: ServiceDependencies;
	}) {
		for (const key of Object.keys(dependencies)) {
			this[key] = dependencies[key];
		}
	}
}

import { ExtractDeps } from "../dependecies/dependency";

export class Service<Deps extends ExtractDeps<Deps> = never> {
	protected readonly deps: Deps = {} as Deps;

	constructor({
		dependencies,
	}: {
		dependencies: Deps;
	}) {
		Object.assign(this.deps, dependencies);
	}
}

type AllowedDependency = Dependency<any>;
export type ExtractDeps<T extends Object, A = AllowedDependency> = {
	[key in keyof T]: A;
};

export class Dependency<Deps extends ExtractDeps<Deps> = never> {
	protected readonly deps: Deps = {} as Deps;

	constructor({
		dependencies,
	}: {
		dependencies: Deps;
	}) {
		Object.assign(this.deps, dependencies);
	}
}

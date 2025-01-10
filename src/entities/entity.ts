import { Id, IdConstructor } from "./value-objects/id";
import { UniqueEntityId } from "./value-objects/unique-entity-id";

export type ExtractProps<E> = E extends Entity<infer Props> ? Props : never;

export type InferedEntity<E> = E extends Entity<infer Props, infer IdType>
	? Entity<Props, IdType>
	: never;

// biome-ignore lint:
export type ExtractId<E> = E extends Entity<any, infer IdType> ? IdType : never;

export type EntityProps = {};

export class Entity<
	Props extends EntityProps,
	IdType extends Id<unknown> = UniqueEntityId,
> {
	protected _id: IdType;
	protected props: Props;

	protected constructor(props: Props, idGen: IdType | IdConstructor<IdType>) {
		this.props = props;
		this._id = idGen instanceof IdConstructor ? idGen.create() : idGen;
	}

	get id() {
		return this._id;
	}

	public equals(entity?: Entity<Props, IdType>) {
		if (entity === null || entity === undefined) {
			return false;
		}

		return this.id.equals(entity.id);
	}
}

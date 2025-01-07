import { Id, IdConstructor } from "./value-objects/id";
import { UniqueEntityId } from "./value-objects/unique-entity-id";

export class Entity<Props, IdType extends Id<unknown> = UniqueEntityId> {
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

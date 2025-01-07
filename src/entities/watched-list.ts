export abstract class WatchedList<T> {
	private currentItems: T[];
	private initial: T[];
	private new: T[];
	private removed: T[];

	constructor(initialItems?: T[]) {
		this.currentItems = initialItems ? initialItems : [];
		this.initial = initialItems ? initialItems : [];
		this.new = [];
		this.removed = [];
	}

	abstract compareItems(a: T, b: T): boolean;

	public get items(): T[] {
		return this.currentItems;
	}

	public get newItems(): T[] {
		return this.new;
	}

	public get removedItems(): T[] {
		return this.removed;
	}

	public isCurrentItem(item: T): boolean {
		return (
			this.currentItems.filter((v: T) => this.compareItems(item, v)).length !==
			0
		);
	}

	private isNewItem(item: T): boolean {
		return this.new.filter((v: T) => this.compareItems(item, v)).length !== 0;
	}

	private isRemovedItem(item: T): boolean {
		return (
			this.removed.filter((v: T) => this.compareItems(item, v)).length !== 0
		);
	}

	private removeFromNew(item: T): void {
		this.new = this.new.filter((v: T) => !this.compareItems(item, v));
	}

	private removeFromCurrent(item: T): void {
		this.currentItems = this.currentItems.filter(
			(v: T) => !this.compareItems(item, v),
		);
	}

	private removeFromRemoved(item: T): void {
		this.removed = this.removed.filter((v: T) => !this.compareItems(item, v));
	}

	private wasAddedInitially(item: T): boolean {
		return (
			this.initial.filter((v: T) => this.compareItems(item, v)).length !== 0
		);
	}

	public add(item: T): void {
		if (this.isRemovedItem(item)) {
			this.removeFromRemoved(item);
		}

		if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
			this.new.push(item);
		}

		if (!this.isCurrentItem(item)) {
			this.currentItems.push(item);
		}
	}

	public remove(item: T): void {
		this.removeFromCurrent(item);

		if (this.isNewItem(item)) {
			this.removeFromNew(item);

			return;
		}

		if (!this.isRemovedItem(item)) {
			this.removed.push(item);
		}
	}

	public update(items: T[]): void {
		const newItems = items.filter((a) => {
			return !this.items.some((b) => this.compareItems(a, b));
		});

		const removedItems = this.items.filter((a) => {
			return !items.some((b) => this.compareItems(a, b));
		});

		this.currentItems = items;
		this.new = newItems;
		this.removed = removedItems;
	}

	public map<U>(fn: (item: T) => U): U[] {
		return this.currentItems.map(fn);
	}
}

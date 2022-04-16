type TupleShift<T extends any[]> = T extends [N: any, ...R: infer R]
	? R
	: never[];

type VectorIndex<
	Dimensions extends number[],
	Curried extends number[],
	Rest extends number[],
	Value = unknown
> = Rest['length'] extends 1
	? Value
	: SubVector<Dimensions, [...Curried, Rest[0]], TupleShift<Rest>, Value>;

export class SubVector<
	Dimensions extends number[],
	Curried extends number[],
	Rest extends number[],
	Value = unknown
> {
	//root: Vector<Dimensions, Value>;
	curried: Curried;
	//rest: Rest;
	[index: number]: VectorIndex<Dimensions, Curried, Rest, Value>;

	constructor(root: Vector<Dimensions, Value>, curried: Curried, rest: Rest) {
		//this.root = root;
		const self = this;
		this.curried = curried;
		//this.rest = rest;

		for (let i = 0; i < rest[0]; i++) {
			const descriptor: PropertyDescriptor = {
				enumerable: false,
				configurable: true,
			};
			if (rest.length === 1) {
				descriptor.get = (): Value => {
					return root.get(...curried, i);
				};
				descriptor.set = (v: Value) => {
					root.set(v, ...curried, i);
				};
			} else {
				descriptor.get = () => {
					const value = new SubVector(
						root,
						[...curried, i],
						rest.slice(1) as TupleShift<Rest>
					);
					Object.defineProperty(self, i, {
						value,
						enumerable: false,
						configurable: true,
					});
					return value;
				};
			}
			Object.defineProperty(this, i, descriptor);
		}
	}
}

export abstract class Vector<Dimensions extends number[], Value = unknown> {
	dimensions: Dimensions;
	[index: number]: VectorIndex<Dimensions, [], Dimensions, Value>;

	constructor(...dimensions: Dimensions) {
		this.dimensions = dimensions;
		const root = this;

		for (let i = 0; i < dimensions[0]; i++) {
			const descriptor: PropertyDescriptor = {
				enumerable: false,
				configurable: true,
			};
			if (dimensions.length === 1) {
				descriptor.get = () => {
					return root.get(i);
				};
				descriptor.set = (v: Value) => {
					root.set(v, i);
				};
			} else {
				descriptor.get = () => {
					const value = new SubVector(root, [i], dimensions.slice(1));
					Object.defineProperty(root, i, {
						value,
						enumerable: false,
						configurable: true,
					});
					return value;
				};
			}
			Object.defineProperty(this, i, descriptor);
		}
	}

	abstract get(...args: number[] & { length: Dimensions['length'] }): Value;
	abstract set(
		val: Value,
		...args: number[] & { length: Dimensions['length'] }
	): void;
}

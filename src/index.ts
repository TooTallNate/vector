type TupleShift<T extends any[]> = T extends [N: any, ...R: infer R]
	? R
	: never[];

type VectorIndex<
	Curried extends number[],
	Rest extends number[],
	Value = unknown
> = Rest['length'] extends 1
	? Value
	: SubVector<[...Curried, Rest[0]], TupleShift<Rest>, Value>;

export class SubVector<
	Curried extends number[],
	Rest extends number[],
	Value = unknown
> {
	[index: number]: VectorIndex<Curried, Rest, Value>;

	constructor(root: Vector<[...Curried, ...Rest], Value>, curried: Curried, rest: Rest) {
		const self = this;

		for (let i = 0; i < rest[0]; i++) {
			const descriptor: PropertyDescriptor = {
				enumerable: false,
				configurable: true,
			};
			if (rest.length === 1) {
				descriptor.get = (): Value => {
                    // @ts-ignore
					return root.get(...curried, i);
				};
				descriptor.set = (v: Value) => {
                    // @ts-ignore
					root.set(v, ...curried, i);
				};
			} else {
				descriptor.get = () => {
					const value = new SubVector(
						root,
						[...curried, i],
						rest.slice(1)
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
	readonly dimensions: Dimensions;
	[index: number]: VectorIndex<[], Dimensions, Value>;

	constructor(...dimensions: Dimensions) {
		this.dimensions = Object.freeze(dimensions) as Readonly<Dimensions>;
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

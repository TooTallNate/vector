import { Vector } from '../src';

class NDimensional<Dimensions extends number[]> extends Vector<
	Dimensions,
	number
> {
	lastSet?: number;
	lastCoords?: Dimensions;
	get(...coords: Dimensions) {
		const sum = coords.reduce((partialSum, a) => partialSum + a, 0);
		return sum;
	}
	set(v: number, ...coords: Dimensions) {
		this.lastSet = v;
		this.lastCoords = coords;
	}
}

describe('Vector', () => {
	describe('1 Dimension', () => {
		it('should get', () => {
			const a = new NDimensional(10);
			expect(a[0]).toEqual(0);
			expect(a[1]).toEqual(1);
			expect(a[5]).toEqual(5);
			expect(a[9]).toEqual(9);

			// Out of bounds
			expect(a[10]).toEqual(undefined);
		});
		it('should set', () => {
			const a = new NDimensional(10);

			a[1] = 10;
			expect(a.lastCoords).toEqual([1]);
			expect(a.lastSet).toEqual(10);

			a[9] = 999;
			expect(a.lastCoords).toEqual([9]);
			expect(a.lastSet).toEqual(999);
		});
	});

	describe('2 Dimensions', () => {
		it('should get', () => {
			const a = new NDimensional(128, 32);
			expect(a[0][0]).toEqual(0);
			expect(a[1][0]).toEqual(1);
			expect(a[0][1]).toEqual(1);
			expect(a[5][4]).toEqual(9);
			expect(a[127][1]).toEqual(128);

			// Out of bounds
			expect(a[128]).toEqual(undefined);
			expect(a[127][32]).toEqual(undefined);
		});
		it('should set', () => {
			const a = new NDimensional(128, 32);

			a[4][10] = 5;
			expect(a.lastCoords).toEqual([4, 10]);
			expect(a.lastSet).toEqual(5);

			a[9][0] = 999;
			expect(a.lastCoords).toEqual([9, 0]);
			expect(a.lastSet).toEqual(999);
		});
		it('should return same instance for SubVector', () => {
			const a = new NDimensional(128, 32);
			expect(a[0] === a[0]).toEqual(true);
			expect(a[0] !== a[1]).toEqual(true);
		});
	});

	describe('3 Dimensions', () => {
		it('should get', () => {
			const a = new NDimensional(128, 32, 5);
			expect(a[0][0][0]).toEqual(0);
			expect(a[1][0][0]).toEqual(1);
			expect(a[0][1][0]).toEqual(1);
			expect(a[5][4][1]).toEqual(10);
			expect(a[127][1][4]).toEqual(132);

			// Out of bounds
			expect(a[128]).toEqual(undefined);
			expect(a[127][32]).toEqual(undefined);
			expect(a[127][31][6]).toEqual(undefined);
		});
		it('should set', () => {
			const a = new NDimensional(128, 32, 5);

			a[4][10][3] = 5;
			expect(a.lastCoords).toEqual([4, 10, 3]);
			expect(a.lastSet).toEqual(5);

			a[9][0][3] = 999;
			expect(a.lastCoords).toEqual([9, 0, 3]);
			expect(a.lastSet).toEqual(999);
		});
		it('should return same instance for SubVector', () => {
			const a = new NDimensional(128, 32, 1);
			expect(a[0][0] === a[0][0]).toEqual(true);
		});
	});
});

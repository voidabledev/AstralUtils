import { promisify } from 'util';
import glob from 'glob';

type ZeroToRandom = (num: number) => number;
type AnyToRandom = (min: number, max: number) => number;

type Random = ZeroToRandom | AnyToRandom;

export const random: Random = (min: number, max?: number): number => {

	if (max === undefined) {
		max = min;
		min = 0;
	}

	return min + Math.round(Math.random() * (max - min));
};

export const search = promisify(glob);
export const wait = promisify(setTimeout);
export function id(base: number, length: number): string {
	let gen = Math.floor(Math.random() * base ** length).toString(base);
	gen = '0'.repeat(length - gen.length) + gen;
	return gen;
}
export const setCharAt = (str: string, index: number, chr: string): string => {
	if (index > str.length - 1) return str;
	return str.substring(0, index) + chr + str.substring(index + 1);
};
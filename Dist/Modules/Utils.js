import { promisify } from 'util';
import glob from 'glob';
export const search = promisify(glob);
export function id(base, length) {
    let gen = Math.floor(Math.random() * base ** length).toString(base);
    gen = '0'.repeat(length - gen.length) + gen;
    return gen;
}

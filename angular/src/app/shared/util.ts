import _uniq from 'lodash.uniq';

export function flatten<T>(arrayOfArrays: T[][]): T[] {
  return arrayOfArrays.reduce((accumulator, currentVal) => accumulator.concat(...currentVal), []);
}

// From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
export function flatDeep(arr, d = 1) {
  return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
               : arr.slice();
}

export function unique<T>(arrayOfArrays: T[][]): T[] {
  return _uniq(flatten(arrayOfArrays));
}

/**
 *
 * @param {text}
 * checks for only `://` in the string and returns true if present
 */
export function isUrl(text: string): boolean {
  return /(:\/{2})/.test(text);
}

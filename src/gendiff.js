import sortBy from 'lodash.sortby';
import parser from './parsers.js';
import { isObject, readFile } from './utils.js';
import DIFF from './consts.js';
import formatter from './formatters/index.js';

function sortKeys(first, second) {
  const merged = new Set([...Object.keys(first), ...Object.keys(second)]);
  return sortBy([...merged]);
}

function diff(obj1, obj2) {
  return sortKeys(obj1, obj2).map((key) => {
    if (!Object.hasOwn(obj1, key)) return { key, diff: DIFF.ADDED, value: obj2[key] };
    if (!Object.hasOwn(obj2, key)) return { key, diff: DIFF.REMOVED, value: obj1[key] };
    if (Object.is(obj1[key], obj2[key])) return { key, diff: DIFF.UNCHANGED, value: obj1[key] };
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      return { key, diff: DIFF.NESTED, value: diff(obj1[key], obj2[key]) };
    }
    return { key, diff: DIFF.CHANGED, oldValue: obj1[key], newValue: obj2[key] };
  });
}

export default function genDiff(filepath1, filepath2, formatType) {
  return formatter(diff(parser(readFile(filepath1)), parser(readFile(filepath2))), formatType);
}

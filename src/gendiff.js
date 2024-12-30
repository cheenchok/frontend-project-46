import sortBy from 'lodash.sortby';
import fs from 'fs';
import parser from './parsers.js';
import isObject from './utils.js';
import DIFF from './consts.js';
import formatter from './formatters/index.js';

const getFormat = (path) => {
  const data = path.split('.');
  return data[data.length - 1];
};

const readFile = (path) => {
  const format = getFormat(path);
  const file = fs.readFileSync(path, 'utf8');

  return { file, format };
};

const sortKeys = (first, second) => {
  const merged = new Set([...Object.keys(first), ...Object.keys(second)]);
  return sortBy([...merged]);
};

const diff = (obj1, obj2) => {
  return sortKeys(obj1, obj2).map((key) => {
    if (!Object.hasOwn(obj1, key)) return { key, diff: DIFF.ADDED, value: obj2[key] };
    if (!Object.hasOwn(obj2, key)) return { key, diff: DIFF.REMOVED, value: obj1[key] };
    if (Object.is(obj1[key], obj2[key])) return { key, diff: DIFF.UNCHANGED, value: obj1[key] };
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      return { key, diff: DIFF.NESTED, value: diff(obj1[key], obj2[key]) };
    }
    return {
      key,
      diff: DIFF.CHANGED,
      oldValue: obj1[key],
      newValue: obj2[key],
    };
  });
};

export default (filepath1, filepath2, formatType) => {
  const obj1 = parser(readFile(filepath1));
  const obj2 = parser(readFile(filepath2));
  const objDifference = diff(obj1, obj2);

  return formatter(objDifference, formatType);
};

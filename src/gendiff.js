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

// prettier-ignore
// conflict between prettier and eslint configuration from hexlet workflow
const diff = (obj1, obj2) => {
  const merged = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  const sortedKeys = sortBy([...merged]);

  return sortedKeys.map((key) => {
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
  })
};

export default (filepath1, filepath2, formatType) => {
  const obj1 = parser({
    format: getFormat(filepath1),
    file: fs.readFileSync(filepath1, 'utf8'),
  });
  const obj2 = parser({
    format: getFormat(filepath2),
    file: fs.readFileSync(filepath2, 'utf8'),
  });
  const objDifference = diff(obj1, obj2);

  return formatter(objDifference, formatType);
};

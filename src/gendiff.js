import { getDataFromFile } from './parsers.js';
import { stylish } from './formatters.js';
import { isObject } from './utils.js';

function genDiffFromObj(data1, data2, withoutPrefix = false) {
  const mergeData = { ...data1, ...data2 };
  const keys = Object.keys(mergeData).sort();

  return keys
    .map((key) => {
      if (key in data1 && key in data2) {
        if (data1[key] === data2[key])
          return { key, value: data1[key], prefix: ' ' };
        if (isObject(data1[key]) && isObject(data2[key]))
          return {
            key,
            value: genDiffFromObj(data1[key], data2[key], withoutPrefix),
            prefix: '',
          };
        return [
          {
            key,
            value: isObject(data1[key])
              ? genDiffFromObj(data1[key], {}, true)
              : data1[key],
            prefix: withoutPrefix ? '' : '-',
          },
          {
            key,
            value: isObject(data2[key])
              ? genDiffFromObj(data2[key], {}, true)
              : data2[key],
            prefix: withoutPrefix ? '' : '+',
          },
        ];
      }
      if (key in data1)
        return {
          key,
          value: isObject(data1[key])
            ? genDiffFromObj(data1[key], {}, true)
            : data1[key],
          prefix: withoutPrefix ? '' : '-',
        };
      if (key in data2)
        return {
          key,
          value: isObject(data2[key])
            ? genDiffFromObj(data2[key], {}, true)
            : data2[key],
          prefix: withoutPrefix ? '' : '+',
        };
    })
    .flat();
}

export function genDiff(filepath1, filepath2) {
  const data1 = getDataFromFile(filepath1);
  const data2 = getDataFromFile(filepath2);
  const diff = genDiffFromObj(data1, data2);

  return stylish(diff);
}

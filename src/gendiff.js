import { getDataFromFile } from './parsers.js';
import { isObject } from './utils.js';
import { DIFF_TYPES } from './consts.js';
import { formatter } from './formatters/index.js';

function genDiffFromObj(data1, data2, isNested = false) {
  const mergeData = { ...data1, ...data2 };
  const keys = Object.keys(mergeData).sort();

  return keys
    .map((key) => {
      if (key in data1 && key in data2) {
        if (data1[key] === data2[key])
          return { key, value: data1[key], diffType: DIFF_TYPES.EQUALITY };

        if (isObject(data1[key]) && isObject(data2[key]))
          return {
            key,
            value: genDiffFromObj(data1[key], data2[key], isNested),
            diffType: DIFF_TYPES.NESTED,
          };

        return [
          {
            key,
            value: isObject(data1[key])
              ? genDiffFromObj(data1[key], {}, true)
              : data1[key],
            diffType: isNested ? DIFF_TYPES.NESTED : DIFF_TYPES.ABSENT,
          },
          {
            key,
            value: isObject(data2[key])
              ? genDiffFromObj(data2[key], {}, true)
              : data2[key],
            diffType: isNested ? DIFF_TYPES.NESTED : DIFF_TYPES.EXTRA,
          },
        ];
      }

      if (key in data1)
        return {
          key,
          value: isObject(data1[key])
            ? genDiffFromObj(data1[key], {}, true)
            : data1[key],
          diffType: isNested ? DIFF_TYPES.NESTED : DIFF_TYPES.ABSENT,
        };

      if (key in data2)
        return {
          key,
          value: isObject(data2[key])
            ? genDiffFromObj(data2[key], {}, true)
            : data2[key],
          diffType: isNested ? DIFF_TYPES.NESTED : DIFF_TYPES.EXTRA,
        };
    })
    .flat();
}

export function genDiff(filepath1, filepath2, formatType) {
  const data1 = getDataFromFile(filepath1);
  const data2 = getDataFromFile(filepath2);
  const diff = genDiffFromObj(data1, data2);

  return formatter(diff, formatType);
}
